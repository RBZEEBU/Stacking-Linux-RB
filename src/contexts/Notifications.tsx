import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import { useAccount, useSignMessage } from "wagmi";
import { FirebaseError } from "firebase/app";
import { httpsCallable } from "firebase/functions";
import {
  getMessaging,
  MessagePayload,
  Messaging,
  onMessage,
} from "firebase/messaging";
import { functions, generateToken } from "@/firebase";
import { AlertsContext } from "./Alerts";
import { Alert_Kind__Enum_Type } from "@/types";

export enum NotificationTopic {
  Alerts = "alerts",
  Promotions = "promotions",
  Rewards = "rewards",
}

export type Subscription = {
  topic: NotificationTopic;
  timestamp: string;
};

type SubscriptionPayload = {
  address: string;
  token: string;
  topic: NotificationTopic;
};

const TOKEN_STORAGE_KEY = "fcm-token";
const NOTIFICATIONS_STORAGE_KEY = "fcm-notifications";

const ALL_TOPICS = Object.values(NotificationTopic);

const getSubscriptions = httpsCallable<
  { address: string; token: string },
  Subscription[]
>(functions, "getSubscriptions");

const subscribe = httpsCallable<{
  address: string;
  token: string;
  signature: string;
}>(functions, "subscribe");

const subscribeToTopic = httpsCallable<SubscriptionPayload>(
  functions,
  "subscribeToTopic",
);

const unsubscribeFromTopic = httpsCallable<SubscriptionPayload>(
  functions,
  "unsubscribeFromTopic",
);

export const initialTopics = ALL_TOPICS.reduce(
  (acc, topic) => ({ ...acc, [topic]: false }),
  {} as Record<NotificationTopic, boolean>,
);

function useNotificationsContext() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { i18n } = useLingui();
  const { showAlert } = useContext(AlertsContext);

  const messagingRef = useRef<Messaging | null>(null);

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifications, setNotifications] = useState<MessagePayload[]>([]);

  const [loadingTopics, setLoadingTopics] = useState(false);
  const [subscriptions, setSubscriptions] = useState(initialTopics);

  useEffect(() => {
    if (typeof window !== "undefined") {
      messagingRef.current = getMessaging();

      const fcmToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (fcmToken) {
        setToken(fcmToken);
      }

      // TODO: implement persistent storage for notifications in Firebase
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        setNotifications(JSON.parse(data));
      }

      const handleMessage = (e: MessageEvent<MessagePayload>) => {
        console.log("Received message from service worker", e.data);
        setNotifications((prev) => [e.data, ...prev]);
      };

      const channel = new BroadcastChannel("sw-notifications");
      channel.addEventListener("message", handleMessage);

      return () => {
        channel.removeEventListener("message", handleMessage);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isSubscribed) {
      // TODO: implement persistent storage for notifications in Firebase
      const json = JSON.stringify(notifications);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, json);
    }
  }, [notifications, isSubscribed]);

  const handleError = (error: unknown) => {
    let message: string;
    if (error instanceof FirebaseError) {
      message = `Firebase Error: ${error.message}`;
    } else if (error instanceof Error) {
      message = `Error: ${error.message}`;
    } else {
      message = t(i18n)`An unknown error occurred`;
    }
    showAlert({ kind: Alert_Kind__Enum_Type.ERROR, message });
  };

  const loadSubscriptions = useCallback(async () => {
    if (!address || !token || !isConnected) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await getSubscriptions({ address, token });
      console.log(data);
      setSubscriptions(
        data.reduce(
          (acc, sub) => ({ ...acc, [sub.topic]: true }),
          initialTopics,
        ),
      );
      setIsSubscribed(true);
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "functions/not-found"
      ) {
        setIsSubscribed(false);
      } else {
        handleError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, token]);

  useEffect(() => {
    if (isSubscribed && messagingRef.current) {
      console.log("subscribed");

      const unsubscribe = onMessage(messagingRef.current, (payload) => {
        console.log(payload);
        setNotifications((prev) => [payload, ...prev]);
      });

      return () => {
        unsubscribe();
        console.log("unsubscribed");
      };
    }

    loadSubscriptions();
  }, [isSubscribed, loadSubscriptions]);

  const subscribeTo = useCallback(
    async (topic: NotificationTopic) => {
      if (address && token) {
        setLoadingTopics(true);
        try {
          await subscribeToTopic({ topic, token, address });
          setSubscriptions((prev) => ({ ...prev, [topic]: true }));
        } catch (err) {
          handleError(err);
        } finally {
          setLoadingTopics(false);
        }
      }
    },
    [address, token],
  );

  const unsubscribeFrom = useCallback(
    async (topic: NotificationTopic) => {
      if (address && token) {
        setLoadingTopics(true);
        try {
          await unsubscribeFromTopic({ topic, token, address });
          setSubscriptions((prev) => ({ ...prev, [topic]: false }));
        } catch (err) {
          handleError(err);
        } finally {
          setLoadingTopics(false);
        }
      }
    },
    [address, token],
  );

  const unsubscribeFromAll = useCallback(async () => {
    if (address && token) {
      try {
        await Promise.all(
          ALL_TOPICS.map((topic) =>
            unsubscribeFromTopic({ topic, token, address }),
          ),
        );
        setSubscriptions(initialTopics);
      } catch (err) {
        handleError(err);
      }
    }
  }, [address, token]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const initSubscriptions = useCallback(async () => {
    if (!address || !messagingRef.current) {
      return;
    }

    try {
      const token = await generateToken(messagingRef.current);
      const message = `Subscribe to notifications: ${token}`;
      const signature = await signMessageAsync({ message });

      await subscribe({ address, token, signature });
      await Promise.all(
        ALL_TOPICS.map((topic) => subscribeToTopic({ token, address, topic })),
      );

      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setToken(token);
      setNotifications([
        {
          messageId: "1",
          from: "zeebu",
          collapseKey: "",
          notification: {
            title: "Welcome",
            body: "You have successfully subscribed to notifications",
          },
          data: {
            topic: "alerts",
            timestamp: Date.now().toString(),
          },
        },
      ]);

      setSubscriptions(
        ALL_TOPICS.reduce(
          (acc, topic) => ({ ...acc, [topic]: true }),
          initialTopics,
        ),
      );
      setIsSubscribed(true);
    } catch (error) {
      handleError(error);
    }
  }, [address, clearNotifications]);

  return {
    isSubscribed,
    loading,
    loadingTopics,
    notifications,
    subscriptions,
    clearNotifications,
    initSubscriptions,
    subscribeTo,
    unsubscribeFrom,
    unsubscribeFromAll,
  };
}

type UseNotificationsContextType = ReturnType<typeof useNotificationsContext>;

export const NotificationsContext = createContext<UseNotificationsContextType>({
  isSubscribed: false,
  loading: false,
  loadingTopics: false,
  notifications: [],
  subscriptions: initialTopics,
  clearNotifications: () => {},
  initSubscriptions: async () => {},
  subscribeTo: async () => {},
  unsubscribeFrom: async () => {},
  unsubscribeFromAll: async () => {},
});

export function NotificationsProvider({ children }: PropsWithChildren) {
  const value = useNotificationsContext();
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
