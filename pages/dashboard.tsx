import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import authOptions from "../src/server/auth";
import { trpc } from "../src/utils/trpc"; // Corrected import path
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/api/auth/signin", permanent: false } };
  }
  return { props: {} };
};

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.getStats.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <p className="mb-4">Total Users: {stats?.totalUsers ?? 0}</p>
      <p>Last Updated: {stats?.lastUpdated?.toLocaleString()}</p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Devices (latest 100)</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Serial</th>
            <th className="py-2 text-left">Hostname</th>
            <th className="py-2 text-left">Platform</th>
            <th className="py-2 text-left">Last Check‑In</th>
          </tr>
        </thead>
        <tbody>
          {stats?.devices?.map(
            (d: {
              id: string;
              serial: string;
              hostname: string;
              platform: string;
              lastCheckIn: string;
            }) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="py-1">{d.serial}</td>
                <td className="py-1">{d.hostname}</td>
                <td className="py-1">{d.platform}</td>
                <td className="py-1">
                  {new Date(d.lastCheckIn).toLocaleString()}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
