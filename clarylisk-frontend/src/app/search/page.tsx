"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  ArrowUpRight,
  AlertCircle,
  ArrowDown,
  Flame,
  Check,
} from "lucide-react";
import { useCreatorDonationHistory } from "@/hooks/smart-contract/read/useGetHistoryDonationTracker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetRiskMessage } from "@/hooks/API/useGetRiskMesage";
import IDRXLogo from "../../../public/img/IDRXLogo.jpg";
import Image from "next/image";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const walletParam = searchParams.get("wallet");

  const [inputValue, setInputValue] = useState(walletParam || "");
  const [searchQuery, setSearchQuery] = useState(walletParam || "");
  const [isSearching, setIsSearching] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc" as "asc" | "desc",
  });
  const [activeTab, setActiveTab] = useState("overview");

  const {
    donations: onchainDonations,
    summary: onchainSummary,
    isLoading: isOnchainLoading,
    isError: isOnchainError,
    error: onchainError,
  } = useCreatorDonationHistory(searchQuery);

  const [riskMap, setRiskMap] = useState<
    Record<
      string,
      { isRisk: boolean | null; isLoading: boolean; isError: boolean }
    >
  >({});
  const { checkRisk } = useGetRiskMessage();

  useEffect(() => {
    const uniqueNotes = Array.from(
      new Set(onchainDonations.map((d) => d.note).filter(Boolean)),
    );
    uniqueNotes.forEach((note) => {
      if (!riskMap[note]) {
        setRiskMap((prev) => ({
          ...prev,
          [note]: { isRisk: null, isLoading: true, isError: false },
        }));  
        Promise.resolve(checkRisk(note))
          .then((res: any) => {
            setRiskMap((prev) => ({
              ...prev,
              [note]: {
                isRisk: res?.isRisk ?? null,
                isLoading: false,
                isError: !!res?.isError,
              },
            }));
          })
          .catch(() => {
            setRiskMap((prev) => ({
              ...prev,
              [note]: { isRisk: null, isLoading: false, isError: true },
            }));
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onchainDonations]);

  const handleSearch = () => {
    if (!inputValue) return;
    setSearchQuery(inputValue);
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const analyticsData = (() => {
    const map: Record<
      string,
      { date: string; accepted: number; burned: number; pending: number }
    > = {};
    onchainDonations.forEach((d) => {
      const date = new Date(d.createdAt * 1000).toLocaleDateString();
      if (!map[date]) map[date] = { date, accepted: 0, burned: 0, pending: 0 };
      if (d.approved) map[date].accepted += Number(d.value);
      else if (d.discarded) map[date].burned += Number(d.value);
      else map[date].pending += Number(d.value);
    });
    return Object.values(map).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  })();

  // Sort donations by createdAt desc for All Transactions
  const sortedDonations = [...onchainDonations].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-[8rem]">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">Donation Tracker</h1>
          <p className="text-gray-400">
            Search for creator contract addresses to track donation history
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Enter Creator Contract Address"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !inputValue}
              className="bg-primary hover:bg-primary/80"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>
        </div>

        {!searchQuery && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-black rounded-xl shadow-lg p-10 border border-gray-800">
            <Search className="h-16 w-16 text-gray-700 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Start Tracking Donations
            </h2>
            <p className="text-gray-400 mb-6 text-center max-w-xl">
              Enter a Creator Contract Address{" "}
              <span className="text-red-500 font-bold">
                (NOT WALLET ADDRESS)
              </span>{" "}
              above to view on-chain donation history, analytics, and more.
              Track your favorite creators or your own contract in real time!
            </p>
            <div className="flex flex-col gap-3 w-full max-w-md"></div>
          </div>
        )}

        {searchQuery && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">
                    {searchQuery.substring(0, 8)}...{searchQuery.slice(-4)}
                  </span>
                  <Badge className="ml-2 bg-primary text-xs">Creator</Badge>
                </div>
                <div className="text-gray-400 font-mono text-xs mt-1">
                  {searchQuery}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800/50 hover:text-white"
                onClick={() =>
                  window.open(
                    `https://blockscout.lisk.com/address/${searchQuery}?tab=txs`,
                    "_blank",
                  )
                }
              >
                View on Lisk Explorer{" "}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-900/80 border-0 shadow-none">
                <CardContent className="pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Received</p>
                    <p className="text-3xl font-bold text-green-400">
                      {onchainSummary.accepted} IDRX{" "}
                      <Image
                        src={IDRXLogo}
                        alt="IDRX"
                        width={40}
                        height={40}
                        className="inline-block rounded-full mb-2"
                      />
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                    <ArrowDown className="h-5 w-5 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/80 border-0 shadow-none">
                <CardContent className="pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {onchainSummary.pending} IDRX{" "}
                      <Image
                        src={IDRXLogo}
                        alt="IDRX"
                        width={40}
                        height={40}
                        className="inline-block rounded-full mb-2"
                      />
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/80 border-0 shadow-none">
                <CardContent className="pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Burned</p>
                    <p className="text-3xl font-bold text-red-400">
                      {onchainSummary.burned} IDRX{" "}
                      <Image
                        src={IDRXLogo}
                        alt="IDRX"
                        width={40}
                        height={40}
                        className="inline-block rounded-full mb-2"
                      />
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-900/20 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <div className="flex gap-4 border-b border-gray-800 mb-4">
                <button
                  className={`px-4 py-2 font-semibold border-b-2 ${activeTab === "overview" ? "text-white bg-gray-900 border-primary" : "text-gray-400 hover:text-white border-transparent"}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 font-semibold border-b-2 ${activeTab === "transactions" ? "text-white bg-gray-900 border-primary" : "text-gray-400 hover:text-white border-transparent"}`}
                  onClick={() => setActiveTab("transactions")}
                >
                  Transactions
                </button>
                <button
                  className={`px-4 py-2 font-semibold border-b-2 ${activeTab === "analytics" ? "text-white bg-gray-900 border-primary" : "text-gray-400 hover:text-white border-transparent"}`}
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </button>
              </div>
              {activeTab === "overview" && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Recent Activity
                  </h3>
                  {onchainDonations.length === 0 ? (
                    <div className="text-gray-400">
                      No onchain donation history found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {onchainDonations.slice(0, 5).map((d, idx) => (
                        <div
                          key={d.penyawer + "-" + d.createdAt + "-" + idx}
                          className="flex items-center justify-between bg-gray-900/70 rounded-lg px-6 py-4"
                        >
                          <div className="flex items-center gap-4">
                            {d.approved && (
                              <div className="h-8 w-8 rounded-full bg-green-900/20 flex items-center justify-center">
                                <ArrowDown className="h-4 w-4 text-green-400" />
                              </div>
                            )}
                            {d.discarded && (
                              <div className="h-8 w-8 rounded-full bg-red-900/20 flex items-center justify-center">
                                <Flame className="h-4 w-4 text-red-400" />
                              </div>
                            )}
                            {!d.approved && !d.discarded && (
                              <div className="h-8 w-8 rounded-full bg-yellow-900/20 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-medium text-white">
                                {d.approved &&
                                  `Donation from ${d.penyawer.substring(0, 6)}...${d.penyawer.slice(-4)}`}
                                {d.discarded &&
                                  `Burned donation from ${d.penyawer.substring(0, 6)}...${d.penyawer.slice(-4)}`}
                                {!d.approved &&
                                  !d.discarded &&
                                  `Pending donation from ${d.penyawer.substring(0, 6)}...${d.penyawer.slice(-4)}`}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(d.createdAt * 1000).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold text-lg ${d.approved ? "text-green-400" : d.discarded ? "text-red-400" : "text-yellow-400"}`}
                            >
                              {d.approved ? "+" : d.discarded ? "-" : ""}
                              {d.value} IDRX{" "}
                              <Image
                                src={IDRXLogo}
                                alt="IDRX"
                                width={20}
                                height={20}
                                className="inline-block rounded-full mb-1"
                              />
                            </p>
                            {d.note && (
                              <p className="text-xs text-gray-400 max-w-[200px] mt-1">
                                "{d.note}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="bg-gray-900/80 rounded-lg p-6 mt-10">
                    <h3 className="text-lg font-medium text-white mb-10">
                      Donation Analytics
                    </h3>
                    {analyticsData.length === 0 ? (
                      <div className="text-gray-400">
                        No data for analytics.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData}>
                          <XAxis dataKey="date" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="accepted"
                            fill="#22c55e"
                            name="Accepted"
                          />
                          <Bar dataKey="burned" fill="#ef4444" name="Burned" />
                          <Bar
                            dataKey="pending"
                            fill="#eab308"
                            name="Pending"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "transactions" && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    All Transactions
                  </h3>
                  {onchainDonations.length === 0 ? (
                    <div className="text-gray-400">
                      No onchain donation history found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-900 text-gray-400">
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">From</th>
                            <th className="px-4 py-2 text-right">Amount</th>
                            <th className="px-4 py-2 text-left">Note</th>
                            <th className="px-4 py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedDonations.map((d, idx) => (
                            <tr
                              key={d.penyawer + "-" + d.createdAt + "-" + idx}
                              className="border-b border-gray-800 hover:bg-gray-800/50"
                            >
                              <td className="px-4 py-2">
                                {d.note ? (
                                  riskMap[d.note]?.isLoading ? (
                                    <span className="text-gray-400">
                                      <Loader2 className="w-4 h-4 animate-spin inline" />
                                    </span>
                                  ) : riskMap[d.note]?.isError ? (
                                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                      Unknown
                                    </span>
                                  ) : riskMap[d.note]?.isRisk === true ? (
                                    <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                      <AlertCircle className="w-4 h-4 inline" />
                                      Risk
                                    </span>
                                  ) : riskMap[d.note]?.isRisk === false ? (
                                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                      <Check className="w-4 h-4 inline" />
                                      Safe
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )
                                ) : d.approved ? (
                                  <span className="text-green-400 font-semibold">
                                    <ArrowDown className="w-4 h-4 text-green-400 bg-green-900/20 rounded-full" />
                                  </span>
                                ) : d.discarded ? (
                                  <span className="text-red-400 font-semibold">
                                    <Flame className="w-4 h-4 text-red-400" />
                                  </span>
                                ) : (
                                  <span className="text-yellow-400 font-semibold">
                                    <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-gray-400">
                                {new Date(d.createdAt * 1000).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 font-mono text-white">
                                {d.penyawer.substring(0, 8)}...
                                {d.penyawer.slice(-4)}
                              </td>
                              <td
                                className={`px-4 py-2 text-right font-bold ${d.approved ? "text-green-400" : d.discarded ? "text-red-400" : "text-yellow-400"}`}
                              >
                                {d.approved ? "+" : d.discarded ? "-" : ""}
                                {d.value}
                                <span className="inline-flex items-center ml-1">
                                  IDRX
                                  <Image
                                    src={IDRXLogo}
                                    alt="IDRX"
                                    width={16}
                                    height={16}
                                    className="inline-block ml-3 rounded-full"
                                  />
                                </span>
                              </td>
                              <td className="px-4 py-2 text-gray-300">
                                {d.note || (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {d.approved ? (
                                  <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded">
                                    Accepted
                                  </span>
                                ) : d.discarded ? (
                                  <span className="bg-red-900/20 text-red-400 px-2 py-1 rounded">
                                    Burned
                                  </span>
                                ) : (
                                  <span className="bg-yellow-900/20 text-yellow-400 px-2 py-1 rounded">
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "analytics" && (
                <div className="bg-gray-900/80 rounded-lg p-6 mt-10">
                  <h3 className="text-lg font-medium text-white mb-10">
                    Donation Analytics
                  </h3>
                  {analyticsData.length === 0 ? (
                    <div className="text-gray-400">No data for analytics.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData}>
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="accepted"
                          fill="#22c55e"
                          name="Accepted"
                        />
                        <Bar dataKey="burned" fill="#ef4444" name="Burned" />
                        <Bar dataKey="pending" fill="#eab308" name="Pending" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
