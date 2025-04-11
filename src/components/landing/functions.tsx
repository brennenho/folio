"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const stepsForInvestors = [
  {
    index: 1,
    title: "Share your portfolio",
    description:
      "Connect your trading account and showcase your performance to potential followers.",
  },
  {
    index: 2,
    title: "Set your terms",
    description:
      "Define your subscription pricing and terms for followers who want to copy your trades.",
  },
  {
    index: 3,
    title: "Earn passive income",
    description:
      "Generate revenue from subscription fees as you continue to trade and grow your follower base.",
  },
];

const stepsForCopyTraders = [
  {
    index: 1,
    title: "Browse Expert Traders",
    description:
      "Explore our marketplace of verified traders with transparent performance metrics and trading styles.",
  },
  {
    index: 2,
    title: "Subscribe to Strategies",
    description:
      "Choose the traders whose strategies align with your investment goals and risk tolerance.",
  },
  {
    index: 3,
    title: "Automatic Trade Copying",
    description:
      "Sit back as our platform automatically executes trades on your behalf, mirroring your chosen experts.",
  },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Functions() {
  return (
    <div className="flex w-full flex-col items-center gap-16">
      <div className="flex flex-col gap-5 text-center leading-none">
        <div className="text-5xl font-semibold tracking-[1.44px]">
          How Folio Works
        </div>
        <div className="text-2xl tracking-[0.72px]">
          Be both an investor and copy trader in our ecosystem.
        </div>
      </div>

      <Tabs defaultValue="investors" className="mx-auto w-3/4">
        <TabsList className="mb-10 grid h-16 w-full grid-cols-2 p-2 text-2xl">
          <TabsTrigger
            value="investors"
            className="h-full data-[state=active]:bg-[#C5D9AE]"
          >
            For Investors
          </TabsTrigger>
          <TabsTrigger
            value="copyTraders"
            className="h-full data-[state=active]:bg-[#C5D9AE]"
          >
            For Copy Traders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investors" className="">
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={listVariants}
          >
            {stepsForInvestors.map((step) => (
              <motion.div
                key={step.title}
                className="space-y-1"
                variants={itemVariants}
                transition={{ type: "tween" }}
              >
                <Step
                  index={step.index}
                  title={step.title}
                  description={step.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="copyTraders" className="">
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={listVariants}
          >
            {stepsForCopyTraders.map((step) => (
              <motion.div
                key={step.title}
                className="space-y-1"
                variants={itemVariants}
                transition={{ type: "tween" }}
              >
                <Step
                  index={step.index}
                  title={step.title}
                  description={step.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Step({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full text-[28px] font-semibold">
        {index}
      </div>
      <div className="flex flex-col">
        <div className="text-[28px] font-semibold">{title}</div>
        <p className="text-2xl text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
