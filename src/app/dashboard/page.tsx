import LeftBar from "@/components/(dashboard)/LeftBar";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-[280px_auto] h-screen w-full bg-gray-100">
      <LeftBar />
      <section className="h-full w-full md:py-3 md:px-1 md:pr-3">
        <main className="h-full w-full rounded-lg bg-white p-2"></main>
      </section>
    </div>
  );
};

export default Dashboard;
