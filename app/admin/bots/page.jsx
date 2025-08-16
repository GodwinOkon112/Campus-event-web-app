"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"; // shadcn import

export default function BotLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); // "Bot" | "Human" | ""
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 20;

  async function fetchLogs() {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
        search,
        filter,
      });
      const res = await fetch(`/api/admin/get-bots?${query.toString()}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching bot logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [page, search, filter]);

  return (
    <div className="  mx-auto mt-[5rem] md:mt-2">
      <h3 className="text-[1rem] font-extrabold mb-6">Bot Detection Logs</h3>

      <div className="flex gap-4 mb-15 mt-6">
        <input
          type="text"
          placeholder="Search by IP or User-Agent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 py-1  rounded w-full sm:w-1/3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="Bot">Bot</option>
          <option value="Human">Human</option>
        </select>
      </div>

      {loading ? (
        <p>Loading bot logs...</p>
      ) : !logs.length ? (
        <p>No bot detections found.</p>
      ) : (
        <>
          {/* shadcn Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {logs.map((log, idx) => (
              <AccordionItem
                key={log._id}
                value={`log-${log._id}`}
                className={` shadow-sm rounded-sm border ${
                  log.detectionResult === "Bot" ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <AccordionTrigger className="flex justify-between items-center px-2 py-1 ">
                  {/* <div className="bg-yellow-300 flex justify-center items-center ">
                    <p className="text-[10px] text-center">
                      {" "}
                      {idx + 1 + (page - 1) * PAGE_SIZE}{" "}
                    </p>
                    <p className="text-[10px] text-center">
                      ip: {log.ip || "Unknown IP"}
                    </p>
                  </div> */}
                  <div
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      log.detectionResult === "Bot"
                        ? " text-red-800"
                        : " text-green-800"
                    }`}
                  >
                    {log.detectionResult}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 text-sm space-y-2">
                  <p>
                    <strong>User Agent:</strong> {log.userAgent || "-"}
                  </p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {log.detectionScore !== null ? log.detectionScore : "-"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "-"}
                  </p>
                  {log.detectionReason && (
                    <p>
                      <strong>Reason:</strong> {log.detectionReason}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex sm:flex-row justify-between items-center gap-3 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-1 font-bold bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-red-500"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-1 font-bold bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
