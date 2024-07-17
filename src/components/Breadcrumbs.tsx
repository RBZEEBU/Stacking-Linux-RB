import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import ArrowRight from "@mui/icons-material/KeyboardArrowRight";

interface BreadcrumbItem {
  href: string;
  title: string;
}

interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ items }) => {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<ArrowRight />}
      sx={{ marginTop: "15px" }}
    >
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;

        if (isLastItem) {
          return (
            <Typography key={index} fontWeight="bold">
              {item.title}
            </Typography>
          );
        }

        return (
          <Typography key={index} fontWeight="bold">
            <Link href={item.href}>{item.title}</Link>
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
