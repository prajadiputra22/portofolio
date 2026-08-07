"use client";

const sidebarNav = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "person", label: "Manage Profile", active: false },
  { icon: "work", label: "Manage Works", active: false },
  { icon: "psychology", label: "Manage Skills", active: false },
  { icon: "rss_feed", label: "Manage Blog", active: false },
];

const quickActions = [
  {
    eyebrow: "Add New",
    title: "Project Node",
    icon: "add_circle",
    variant: "primary",
    hoverBorder: "",
  },
  {
    eyebrow: "Write New",
    title: "Blog Entry",
    icon: "edit_square",
    variant: "default",
    hoverBorder: "hover:border-primary",
  },
  {
    eyebrow: "Media",
    title: "Asset Library",
    icon: "cloud_upload",
    variant: "default",
    hoverBorder: "hover:border-secondary",
  },
  {
    eyebrow: "Export",
    title: "Data Report",
    icon: "download",
    variant: "default",
    hoverBorder: "hover:border-tertiary",
  },
];

const stats = [
  {
    icon: "folder",
    label: "Total Projects",
    value: "24",
    delta: "+2.4%",
    deltaColor: "text-[#0bda62]",
    barColor: "bg-primary",
    barWidth: "w-2/3",
    note: "Updated 12 minutes ago",
  },
  {
    icon: "visibility",
    label: "Blog Views (30d)",
    value: "12.5k",
    delta: "+15.8%",
    deltaColor: "text-[#0bda62]",
    barColor: "bg-secondary",
    barWidth: "w-[85%]",
    note: "Trend is increasing significantly",
  },
  {
    icon: "mail",
    label: "Active Inquiries",
    value: "08",
    delta: "-1.2%",
    deltaColor: "text-error",
    barColor: "bg-tertiary",
    barWidth: "w-1/4",
    note: "3 new messages pending review",
  },
];

const activities = [
  {
    icon: "rocket_launch",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "New project deployment",
    description: '"Cyber-Grid Interface" was pushed to production.',
    time: "09:42 AM",
    tag: "Success",
    tagClass: "bg-[#0bda62]/20 text-[#0bda62]",
  },
  {
    icon: "edit_note",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    title: "Blog post draft created",
    description: '"The Future of Web3 UX" saved by Super Admin.',
    time: "Yesterday",
    tag: "Draft",
    tagClass: "bg-outline-variant text-on-surface-variant",
  },
  {
    icon: "warning",
    iconBg: "bg-error/10",
    iconColor: "text-error",
    title: "Contact form alert",
    description: "Unusually high traffic detected on contact API.",
    time: "Yesterday",
    tag: "Alert",
    tagClass: "bg-error/20 text-error",
  },
  {
    icon: "image",
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    title: "Asset sync completed",
    description: "12 High-res images synchronized with CDN.",
    time: "Oct 24",
    tag: "Sync",
    tagClass: "bg-[#0bda62]/20 text-[#0bda62]",
  },
];

const networkLoad = [
  { height: "40%", value: "3.2GB", active: false },
  { height: "60%", value: "4.1GB", active: false },
  { height: "45%", value: "3.8GB", active: false },
  { height: "80%", value: "7.2GB", active: false },
  { height: "70%", value: "6.5GB", active: false },
  { height: "95%", value: "9.1GB", active: false },
  { height: "85%", value: "Active", active: true },
];

const storage = [
  { label: "Media Assets", size: "420 GB", barColor: "bg-secondary", width: "w-[65%]" },
  { label: "Database Clusters", size: "12 GB", barColor: "bg-tertiary", width: "w-[22%]" },
];

export default function Dashboard() {
  return (
    <div
      className="relative flex h-screen w-full bg-[#15181e] dark overflow-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      {/* Sidebar Navigation */}
      <aside className="flex h-full w-64 flex-col border-r border-[#2b3140] bg-[#101415] shrink-0">
        <div className="flex items-center gap-4 px-6 py-8 text-white">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Admin Console
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {sidebarNav.map((item) => (
            <a
              key={item.label}
              className={
                item.active
                  ? "flex items-center gap-3 px-3 py-2 rounded bg-primary/10 text-primary font-bold"
                  : "flex items-center gap-3 px-3 py-2 rounded text-on-surface-variant hover:bg-[#2b3140] hover:text-white transition-colors"
              }
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[#2b3140]">
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAiGjBwlQJ0A3PvFBcUQ0GkyQkc8j9yVCm53tcobi6xizxpLBkf3XX1uE8j7ySqOTh1towGmmlkac9ykMG7mwCRgvdFYSAY6MhH06drLJgQTd19p4wDbTbYDLkiOcE0VgTwqg6Vdo980qFJ97AjDyCzWTt3qI8ewrylwWHHGgEqVLIgm6VZ224u0tZSVvkbYdgY49yJVHdlXVEDuykLHlg13GxYU8cXTF3hnLOgqHrqM_PZNV8Y0r_gLfb28LWga2Wmb5l_bk3QE3ke")',
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate">Super Admin</span>
              <span className="text-on-surface-variant text-[10px] truncate">
                admin@system.local
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="layout-container flex h-full grow flex-col overflow-y-auto">
        {/* Top Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2b3140] px-8 py-3 shrink-0">
          <div className="flex items-center gap-4">
            <label className="flex flex-col min-w-40 !h-9 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded h-full">
                <div className="text-[#9ea7bd] flex border-none bg-[#2b3140] items-center justify-center pl-4 rounded-l border-r-0">
                  <span className="material-symbols-outlined text-sm">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-white focus:outline-0 focus:ring-0 border-none bg-[#2b3140] focus:border-none h-full placeholder:text-[#9ea7bd] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                  placeholder="Search data points..."
                />
              </div>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center justify-center rounded h-9 w-9 bg-[#2b3140] text-white hover:bg-[#32384a] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button
              className="flex items-center justify-center rounded h-9 w-9 bg-[#2b3140] text-white hover:bg-[#32384a] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
        </header>

        <main className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto w-full">
          {/* Hero Section */}
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-on-surface text-4xl font-black leading-tight tracking-[-0.033em]">
                Dashboard Overview
              </h1>
              <p className="text-on-surface-variant text-base font-normal leading-normal">
                System monitoring and portfolio telemetry across all nodes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant">
                <span className="size-2 rounded-full bg-[#0bda62] animate-pulse" />
                <span className="text-on-surface text-xs font-mono uppercase tracking-wider">
                  System Status: Nominal
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                className={
                  action.variant === "primary"
                    ? "group flex items-center justify-between p-4 bg-primary text-on-primary rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/10"
                    : `group flex items-center justify-between p-4 bg-surface-container-high text-on-surface border border-outline-variant rounded-xl transition-all hover:bg-surface-bright ${action.hoverBorder}`
                }
                type="button"
              >
                <div className="flex flex-col items-start text-left">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      action.variant === "primary" ? "opacity-70" : "text-on-surface-variant"
                    }`}
                  >
                    {action.eyebrow}
                  </span>
                  <span className="text-lg font-bold">{action.title}</span>
                </div>
                <span className="material-symbols-outlined text-2xl">{action.icon}</span>
              </button>
            ))}
          </section>

          {/* Statistics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-card-glow flex flex-col gap-4 rounded-xl p-6 bg-surface-container-low border border-outline-variant relative overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(189,198,224,0.1)] hover:border-primary"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span
                    className="material-symbols-outlined text-6xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {stat.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-white text-4xl font-black">{stat.value}</h3>
                    <span className={`${stat.deltaColor} text-sm font-bold mb-1`}>
                      {stat.delta}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${stat.barColor} ${stat.barWidth}`} />
                </div>
                <p className="text-on-surface-variant text-xs font-normal">{stat.note}</p>
              </div>
            ))}
          </section>

          {/* Activity and Secondary Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity List */}
            <div className="lg:col-span-2 flex flex-col bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/30">
                <h3 className="text-on-surface text-lg font-bold">Recent Telemetry Activity</h3>
                <button className="text-primary text-sm font-bold hover:underline" type="button">
                  View All Logs
                </button>
              </div>
              <div className="flex flex-col divide-y divide-outline-variant">
                {activities.map((activity) => (
                  <div
                    key={activity.title}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-highest transition-colors"
                  >
                    <div
                      className={`size-10 rounded-lg ${activity.iconBg} flex items-center justify-center ${activity.iconColor}`}
                    >
                      <span className="material-symbols-outlined">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-on-surface text-sm font-semibold">{activity.title}</p>
                      <p className="text-on-surface-variant text-xs">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-on-surface-variant text-xs font-mono">{activity.time}</p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${activity.tagClass}`}
                      >
                        {activity.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar / Quick Performance */}
            <div className="flex flex-col gap-6">
              {/* Visual Performance Graphic */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
                <h4 className="text-on-surface text-sm font-bold uppercase tracking-widest">
                  Network Load
                </h4>
                <div className="h-32 flex items-end gap-1 relative z-10">
                  {networkLoad.map((bar, index) => (
                    <div
                      key={index}
                      className={
                        bar.active
                          ? "flex-1 bg-primary rounded-t animate-pulse cursor-help"
                          : "flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40 cursor-help"
                      }
                      style={{ height: bar.height }}
                      title={bar.value}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>T-Minus 7h</span>
                  <span>Real-Time</span>
                </div>
              </div>

              {/* System Storage */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-on-surface text-sm font-bold uppercase tracking-widest">
                    Storage Allocation
                  </h4>
                  <span className="text-xs font-mono text-on-surface-variant">74% Full</span>
                </div>
                <div className="flex flex-col gap-3">
                  {storage.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface">{item.label}</span>
                        <span className="text-on-surface-variant">{item.size}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full ${item.barColor} ${item.width}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}