import { Avatar, Box } from "@mui/material";
import { styled } from "@mui/system";

type PoolAvatarProps = {
  srcToken1: string;
  srcToken2: string;
};

const AvatarWrapper = styled(Box)({
  position: "relative",
  display: "inline-block",
});

const MainAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const SmallAvatar = styled(Avatar)({
  position: "absolute",
  bottom: -3,
  right: -3,
  width: 24,
  height: 24,
  border: "1px solid white",
});

export default function PoolAvatar(props: PoolAvatarProps) {
  const { srcToken1, srcToken2 } = props;

  return (
    <AvatarWrapper>
      <MainAvatar src={srcToken1} />
      <SmallAvatar src={srcToken2} />
    </AvatarWrapper>
  );
}
