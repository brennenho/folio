import { ChatArea } from "@/components/chat";
import { TabBar } from "@/components/tab-bar";

export default function Chat() {
  return (
    <div className="flex w-full">
      <TabBar />
      <ChatArea />
    </div>
  );
}
