import {
  Users,
  GraduationCap,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  Activity,
  UserPlus,
  CreditCard,
  UserCheck
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Users",
      value: "120",
      icon: Users,
      color: "blue",
      trend: "+12% from last month",
      bg: "bg-blue-50 text-blue-600"
    },
    {
      label: "Students",
      value: "80",
      icon: GraduationCap,
      color: "emerald",
      trend: "+5 new today",
      bg: "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Pending Payments",
      value: "15",
      icon: Clock,
      color: "amber",
      trend: "Requires attention",
      bg: "bg-amber-50 text-amber-600"
    },
  ];

  const activities = [
    {
      text: "New student registered",
      time: "2 minutes ago",
      type: "user",
      icon: UserPlus,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      text: "Payment received from John Doe",
      time: "45 minutes ago",
      type: "payment",
      icon: CreditCard,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      text: "Associate account updated",
      time: "2 hours ago",
      type: "update",
      icon: UserCheck,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      text: "New course banner added",
      time: "5 hours ago",
      type: "system",
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Super Admin Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back! Here's what's happening with NSkill India today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-slate-700">Platform Growth: <span className="text-emerald-500">+18%</span></span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-50 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${stat.bg}`}></div>

            <div className="flex items-start justify-between relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
            </div>

            <div className="mt-8 relative z-10">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <h2 className="text-4xl font-black text-slate-800">{stat.value}</h2>
              </div>
              <p className={`text-xs font-bold mt-4 flex items-center gap-1 ${stat.color === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {stat.color !== 'amber' && <TrendingUp className="w-3 h-3" />}
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Section: Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 border border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
            </div>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 bg-blue-50 rounded-lg">View All</button>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-4 w-px bg-slate-100"></div>

            <div className="space-y-8">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-6 relative group">
                  <div className={`w-12 h-12 rounded-2xl ${activity.bg} flex items-center justify-center z-10 shadow-sm border border-white group-hover:scale-110 transition-transform duration-300`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-700 font-bold group-hover:text-blue-600 transition-colors">{activity.text}</p>
                      <span className="text-xs font-medium text-slate-400">{activity.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Status: Verified
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Insights / Active Status */}
        <div className="bg-[#0b1f3a] rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            Quick Insights
          </h3>

          <div className="space-y-6 relative z-10">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Attendance Rate</p>
              <div className="flex items-end justify-between mt-2">
                <h4 className="text-3xl font-black">94.2%</h4>
                <span className="text-emerald-400 text-xs font-bold">+2.4%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-blue-500 h-full w-[94%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Course Completion</p>
              <div className="flex items-end justify-between mt-2">
                <h4 className="text-3xl font-black">76%</h4>
                <span className="text-blue-400 text-xs font-bold">Stable</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[76%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 mt-4 active:scale-95">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}