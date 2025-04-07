import { TradeHistory } from "@/components/trade/history";
import { Order } from "@/components/trade/order";

export default function Trade() {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-4">
      <div className="m-4 flex w-[260px] flex-col items-center border-b-[0.2px] p-4 text-muted-foreground">
        Make a Trade
      </div>
      <div className="flex w-full justify-center">
        <Order />
      </div>
      <div className="m-4 flex w-[260px] flex-col items-center border-b-[0.2px] p-4 text-muted-foreground">
        Trade History
      </div>
      <div className="md:w-4/5 md:px-8">
        <TradeHistory />
      </div>
    </div>
  );
}
