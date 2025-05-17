"use client";

import { Globe, Flame, BarChart3, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-900 " id="how-it-works">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How Clarylisk Works
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Our platform leverages the transparency and security of blockchain
            technology to create a verifiable donation ecosystem.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="donors" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-800">
              <TabsTrigger
                value="donors"
                className="data-[state=active]:bg-purple-900 data-[state=active]:text-white"
              >
                For Donors
              </TabsTrigger>
              <TabsTrigger
                value="creators"
                className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                For Creators
              </TabsTrigger>
              <TabsTrigger
                value="platforms"
                className="data-[state=active]:bg-green-900 data-[state=active]:text-white"
              >
                For Platforms
              </TabsTrigger>
            </TabsList>

            <div className="bg-gray-800/50 rounded-lg border border-white/10 p-6">
              <TabsContent value="donors" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      step: "01",
                      title: "Connect Wallet",
                      description:
                        "Securely connect your Web3 wallet to the Clarylisk platform.",
                      icon: <Globe className="w-8 h-8 text-purple-500" />,
                    },
                    {
                      step: "02",
                      title: "Choose Amount",
                      description:
                        "Select how much you want to donate to burn gambling funds.",
                      icon: <Flame className="w-8 h-8 text-purple-500" />,
                    },
                    {
                      step: "03",
                      title: "Track Impact",
                      description:
                        "Monitor your donations impact with transparent blockchain tracking.",
                      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-800/50 border border-purple-500/20"
                    >
                      <CardHeader className="pb-2">
                        <div className="text-xs font-bold text-purple-500 mb-1">
                          {item.step}
                        </div>
                        <CardTitle className="text-white text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">{item.icon}</div>
                        <CardDescription className="text-white/70">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Link href="/explore">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Make Your First Donation
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="creators" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      step: "01",
                      title: "Verify Identity",
                      description:
                        "Complete our simple verification process to create your creator profile.",
                      icon: <Shield className="w-8 h-8 text-blue-500" />,
                    },
                    {
                      step: "02",
                      title: "Set Donation Goals",
                      description:
                        "Create transparent donation goals for your community to support.",
                      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
                    },
                    {
                      step: "03",
                      title: "Share Your Impact",
                      description:
                        "Showcase your anti-gambling stance with verifiable donation receipts.",
                      icon: <ExternalLink className="w-8 h-8 text-blue-500" />,
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-800/50 border border-blue-500/20"
                    >
                      <CardHeader className="pb-2">
                        <div className="text-xs font-bold text-blue-500 mb-1">
                          {item.step}
                        </div>
                        <CardTitle className="text-white text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">{item.icon}</div>
                        <CardDescription className="text-white/70">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Create Creator Profile
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="platforms" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      step: "01",
                      title: "Platform Integration",
                      description:
                        "Integrate our blockchain protocol into your donation infrastructure.",
                      icon: <Globe className="w-8 h-8 text-green-500" />,
                    },
                    {
                      step: "02",
                      title: "Verify Transactions",
                      description:
                        "Ensure all donations are properly tracked and verified on-chain.",
                      icon: <Shield className="w-8 h-8 text-green-500" />,
                    },
                    {
                      step: "03",
                      title: "Demonstrate Responsibility",
                      description:
                        "Show your commitment to responsible practices with transparent reporting.",
                      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-800/50 border border-green-500/20"
                    >
                      <CardHeader className="pb-2">
                        <div className="text-xs font-bold text-green-500 mb-1">
                          {item.step}
                        </div>
                        <CardTitle className="text-white text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">{item.icon}</div>
                        <CardDescription className="text-white/70">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Partner With Us
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
