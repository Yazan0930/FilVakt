import DashboardIcon from "../assets/icons/fill/Dashboard";
import CommentIcon from "../assets/icons/fill/Comment";
import MessageIcon from "../assets/icons/fill/Message";
import ChartIcon from "../assets/icons/fill/Chart";
import CreditIcon from "../assets/icons/fill/Credit";

export default function sideBarItem(pathname: string) {
  return [
    { title: "dashboard", Icon: <DashboardIcon isActive={pathname === "/"} />, href: "/" },
    { title: "comments", Icon: <CommentIcon isActive={pathname === "/comments"} />, href: "/comments" },
    { title: "messages", Icon: <MessageIcon isActive={pathname === "/messages"} />, href: "/messages" },
    { title: "statistics", Icon: <ChartIcon isActive={pathname === "/statistics"} />, href: "/statistics" },
    { title: "Add new user", Icon: <CreditIcon isActive={pathname === "/newUser"} />, href: "/newUser" },
  ];
}
