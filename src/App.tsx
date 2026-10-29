import { useState } from "react";

type Screen = "home" | "fields" | "alerts" | "reports" | "settings" | "sensor" | "irrigation" | "cooperative";

const icons: Record<string, string> = {
  home: "M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z",
  fields: "M4 20c9 0 15-5 16-16C9 4 4 9 4 20Zm0 0c3-5 7-8 12-11",
  alerts: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  reports: "M5 20V10m7 10V4m7 16v-7",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.2-6.2-1.4 1.4M6.7 17.3l-1.4 1.4m13.4 0-1.4-1.4M6.7 6.7 5.3 5.3",
  chevron: "m9 18 6-6-6-6",
  close: "m6 6 12 12M18 6 6 18",
  phone: "M6 2h4l2 5-3 2c2 4 4 6 8 8l2-3 5 2v4c0 2-2 3-4 3C10 22 2 14 2 4c0-1 2-2 4-2",
};

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={icons[name] || icons.fields} /></svg>;
}

function Button({ children, onClick, kind = "primary", className = "" }: { children: React.ReactNode; onClick?: () => void; kind?: "primary" | "secondary" | "danger"; className?: string }) {
  return <button onClick={onClick} className={`button ${kind} ${className}`}>{children}</button>;
}

function Status({ children, tone = "good" }: { children: React.ReactNode; tone?: "good" | "warn" | "critical" | "offline" }) {
  return <span className={`status ${tone}`}><i />{children}</span>;
}

function FarmArt({ small = false }: { small?: boolean }) {
  return (
    <svg className={small ? "farm-art small" : "farm-art"} viewBox="0 0 260 170" role="img" aria-label="Farmer tending rice plants">
      <path d="M4 137c44-24 88-21 128-3 44 19 81 7 124-13v49H4Z" fill="#7BD389" />
      <path d="M16 151c45-19 76-10 110 5 36 16 73 3 124-16" fill="none" stroke="#2F4A3A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="142" cy="48" r="18" fill="#C97B4B" stroke="#2F4A3A" strokeWidth="3" />
      <path d="M105 43c14-20 56-23 76 3-28 8-52 7-76-3Z" fill="#F4D06F" stroke="#2F4A3A" strokeWidth="3" />
      <path d="m128 67-16 50m44-50 14 48M120 78l37 3 1 48-48-2Z" fill="#E8873A" stroke="#2F4A3A" strokeWidth="3" strokeLinejoin="round" />
      <path d="m117 86-29 25m72-23 22 22" fill="none" stroke="#2F4A3A" strokeWidth="6" strokeLinecap="round" />
      <path d="M62 141c0-18 0-31-12-43m12 31c0-17 10-27 19-32m-18 21-14-14m44 42c0-17 1-27-9-39m9 28c2-14 10-21 17-25" fill="none" stroke="#2F4A3A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const nav = [
  ["home", "Home"], ["fields", "Fields"], ["alerts", "Alerts"], ["reports", "Reports"], ["settings", "Settings"],
] as const;

function Sidebar({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  return <aside className="sidebar">
    <button className="brand" onClick={() => go("home")}><span className="brand-mark">A</span><span>AgriSense</span></button>
    <div className="farm-switch"><span className="eyebrow">CURRENT FARM</span><strong>San Isidro Rice Farm</strong><span>4 sensors connected</span></div>
    <nav>{nav.map(([key, label]) => <button key={key} onClick={() => go(key)} className={screen === key ? "active" : ""}><Icon name={key} /><span>{label}</span>{key === "alerts" && <b>3</b>}</button>)}</nav>
    <button className={screen === "cooperative" ? "coop active" : "coop"} onClick={() => go("cooperative")}><Icon name="fields" /><span>Cooperative</span></button>
    <div className="sidebar-help"><strong>Need help?</strong><span>Call our farmer support line.</span><button><Icon name="phone" size={17} /> 0917 123 4567</button></div>
  </aside>;
}

function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  return <nav className="bottom-nav">{nav.map(([key, label]) => <button key={key} onClick={() => go(key)} className={screen === key ? "active" : ""}><Icon name={key} size={21} /><span>{label}</span>{key === "alerts" && <b>3</b>}</button>)}</nav>;
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className="page-header"><div><span className="mobile-brand">AgriSense</span><h1>{title}</h1><p>{subtitle}</p></div><div className="header-actions"><button className="offline"><span /> Online</button><button className="avatar">MR</button></div></header>;
}

const readings = [
  { icon: "◇", label: "Soil Moisture", value: "42", unit: "%", status: "Good", tone: "good", change: "2% from yesterday", color: "green" },
  { icon: "☼", label: "Soil Temperature", value: "31", unit: "°C", status: "Needs attention", tone: "warn", change: "3° warmer today", color: "orange" },
  { icon: "≋", label: "Water Level", value: "68", unit: "cm", status: "Good", tone: "good", change: "Tank is 76% full", color: "blue" },
  { icon: "ϟ", label: "Sensor Power", value: "86", unit: "%", status: "Solar charging", tone: "good", change: "About 9 days left", color: "yellow" },
] as const;

function MiniChart() {
  return <svg className="chart" viewBox="0 0 700 180" preserveAspectRatio="none" aria-label="Seven day soil moisture trend">
    <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7BD389" stopOpacity=".35" /><stop offset="1" stopColor="#7BD389" stopOpacity="0" /></linearGradient></defs>
    {[30, 75, 120, 165].map(y => <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#DCD8C7" strokeDasharray="4 7" />)}
    <path d="M0 118C55 112 62 68 112 78s82 52 128 25 74-45 121-22 74 51 119 30 70-79 112-61 62 45 108 31v99H0Z" fill="url(#area)" />
    <path d="M0 118C55 112 62 68 112 78s82 52 128 25 74-45 121-22 74 51 119 30 70-79 112-61 62 45 108 31" fill="none" stroke="#397A4A" strokeWidth="4" strokeLinecap="round" />
    <circle cx="700" cy="81" r="7" fill="#397A4A" stroke="#fff" strokeWidth="4" />
  </svg>;
}

function Dashboard({ go }: { go: (s: Screen) => void }) {
  return <><Header title="Good morning, Mario" subtitle="Here’s what’s happening on your farm today." />
    <div className="weather"><div><span className="weather-icon">☼</span><div><strong>29°C</strong><span>Partly cloudy</span></div></div><span>Feels like 32°</span><span>Humidity 78%</span><span>Rain chance 20%</span><span className="updated">Updated just now</span></div>
    <section className="hero"><div><Status>All systems are working</Status><h2>Your farm looks healthy today.</h2><p>Soil moisture is at a good level. Plot 3 is warmer than usual—we’ll keep watching it for you.</p><Button onClick={() => go("fields")} kind="secondary">View all fields <Icon name="chevron" size={18} /></Button></div><FarmArt /></section>
    <div className="section-heading"><div><h2>Live sensor readings</h2><p>San Isidro Rice Farm • Last updated 2 min ago</p></div><button className="text-button" onClick={() => go("fields")}>See all sensors <Icon name="chevron" size={16} /></button></div>
    <div className="reading-grid">{readings.map((r, i) => <button className={`reading-card ${r.color}`} key={r.label} onClick={() => i === 0 && go("sensor")}><div className="reading-top"><span className="sensor-icon">{r.icon}</span><Status tone={r.tone as "good" | "warn"}>{r.status}</Status></div><span className="label">{r.label}</span><strong>{r.value}<small>{r.unit}</small></strong><span className="change">{r.change}</span>{i === 0 && <span className="tap-hint">View details →</span>}</button>)}</div>
    <div className="dashboard-lower"><section className="panel trend"><div className="section-heading"><div><h2>Soil moisture trend</h2><p>Average across all fields</p></div><select aria-label="Chart range"><option>Last 7 days</option><option>Last month</option></select></div><MiniChart /><div className="days">{["Mon","Tue","Wed","Thu","Fri","Sat","Today"].map(x => <span key={x}>{x}</span>)}</div></section>
      <section className="panel alerts-preview"><div className="section-heading"><div><h2>Needs your attention</h2><p>2 items to check</p></div><button className="text-button" onClick={() => go("alerts")}>View all</button></div><div className="alert-row"><span className="alert-icon">!</span><div><strong>Plot 3 is getting warm</strong><span>31°C • 8 min ago</span></div><Icon name="chevron" /></div><div className="alert-row yellow"><span className="alert-icon">ϟ</span><div><strong>Sensor B battery is low</strong><span>18% • 1 hour ago</span></div><Icon name="chevron" /></div></section></div>
  </>;
}

function Fields({ go }: { go: (s: Screen) => void }) {
  const sensors = [["Field A • Moisture","Online","86%","2 min ago"],["Field B • Water level","Online","72%","5 min ago"],["Field C • Temperature","Attention","64%","8 min ago"],["Pump House","Offline","18%","Yesterday"]];
  return <><Header title="Fields & sensors" subtitle="See every sensor across your farm." /><div className="field-layout"><section className="map panel"><div className="map-label"><strong>San Isidro Rice Farm</strong><span>4.8 hectares</span></div>{[["A","25%","27%"],["B","68%","58%"],["C","44%","76%"],["P","72%","33%"]].map(([x,l,t])=><button onClick={() => go("sensor")} className="pin" key={x} style={{left:l,top:t}}>{x}</button>)}<div className="plot-lines" /></section><section className="panel sensor-list"><div className="section-heading"><div><h2>4 sensors</h2><p>3 online, 1 offline</p></div><Button kind="secondary">+ Add sensor</Button></div>{sensors.map((s,i)=><button key={s[0]} onClick={() => go("sensor")} className="sensor-row"><span className={`sensor-dot ${i===3?"off":i===2?"warn":""}`}>◇</span><div><strong>{s[0]}</strong><span><Status tone={i===3?"offline":i===2?"warn":"good"}>{s[1]}</Status> Battery {s[2]} • {s[3]}</span></div><Icon name="chevron" /></button>)}</section></div></>;
}

function SensorDetail({ go }: { go: (s: Screen) => void }) {
  return <><button className="back" onClick={() => go("home")}>← Back to dashboard</button><Header title="Field A soil sensor" subtitle="Sensor AS-2048 • Online • Updated 2 min ago" /><div className="detail-grid"><section className="panel live-reading"><span className="eyebrow">LIVE SOIL MOISTURE</span><strong>42<small>%</small></strong><Status>Good level</Status><p>Your target range is 30–60%. No action is needed.</p><div className="range"><span style={{width:"42%"}} /></div><div className="range-labels"><span>Dry 0%</span><span>Good 30–60%</span><span>Wet 100%</span></div></section><section className="panel sensor-actions"><h2>Quick actions</h2><Button onClick={() => go("irrigation")}>Control irrigation <Icon name="chevron" size={18}/></Button><Button kind="secondary">Adjust thresholds</Button><Button kind="secondary">Calibrate or rename</Button></section></div><section className="panel history"><div className="section-heading"><div><h2>Reading history</h2><p>Moisture levels over time</p></div><div className="segmented"><button className="active">Day</button><button>Week</button><button>Month</button></div></div><MiniChart /></section></>;
}

function Alerts({ settings, setSettings }: { settings: boolean; setSettings: (x:boolean)=>void }) {
  if (settings) return <><button className="back" onClick={()=>setSettings(false)}>← Back to alerts</button><Header title="How should we alert you?" subtitle="Choose where to receive important farm updates."/><section className="panel settings-panel"><h2>Delivery channels</h2>{[["SMS text message","Works without internet","on"],["Messenger group","San Isidro Farmers Group","on"],["Viber or Telegram","Connect a group chat",""],["In-app notification","When AgriSense is open","on"]].map(x=><label className="channel" key={x[0]}><span className="channel-icon">{x[0][0]}</span><div><strong>{x[0]}</strong><span>{x[1]}</span></div><input type="checkbox" defaultChecked={!!x[2]}/></label>)}<hr/><h2>Alert thresholds</h2><div className="threshold"><span>Low soil moisture</span><strong>Below 30%</strong></div><div className="threshold"><span>High temperature</span><strong>Above 34°C</strong></div><Button>Save alert settings</Button></section></>;
  return <><Header title="Alerts" subtitle="Simple updates about what needs your attention."/><div className="filter-row"><button className="active">All <b>3</b></button><button>Needs action</button><button>Updates</button><Button kind="secondary" onClick={()=>setSettings(true)}>Alert settings</Button></div><section className="panel alert-list">{[["critical","Water level is critically low","Pump House • 12 cm","10 min ago"],["warn","Plot 3 temperature is high","Field C • 35°C","28 min ago"],["warn","Sensor B battery is low","Field B • 18% remaining","1 hour ago"],["good","Irrigation completed","Field A • Ran for 24 minutes","Yesterday"]].map(x=><div className="full-alert" key={x[1]}><span className={`alert-symbol ${x[0]}`}>!</span><div><strong>{x[1]}</strong><span>{x[2]}</span></div><time>{x[3]}</time><button>Mark as read</button></div>)}</section></>;
}

function Reports() {
  return <><Header title="Savings report" subtitle="See how AgriSense is helping your cooperative."/><section className="savings-hero"><span>THIS MONTH</span><h2>You saved <strong>18,400 liters</strong> of water</h2><p>That’s enough to fill 92 large water drums.</p><div className="report-actions"><Button>Export PDF</Button><Button kind="secondary">Share to group chat</Button></div></section><div className="report-grid">{[["Water saved","18.4k","liters","+24%"],["Electricity saved","68","kWh","+12%"],["Labor saved","32","hours","+18%"]].map(x=><section className="panel stat" key={x[0]}><span>{x[0]}</span><strong>{x[1]} <small>{x[2]}</small></strong><Status>{x[3]} this month</Status></section>)}</div><section className="panel bars"><div className="section-heading"><div><h2>Weekly savings</h2><p>Compared with manual irrigation</p></div><select><option>Water usage</option></select></div><div className="bar-chart">{[46,72,59,88,64,93,78].map((h,i)=><div key={i}><span style={{height:`${h}%`}}/><small>{["W1","W2","W3","W4","W5","W6","Now"][i]}</small></div>)}</div></section></>;
}

function Settings() {
  return <><Header title="Settings & help" subtitle="Manage your account, devices, and accessibility."/><div className="settings-grid">{[["Profile & language","Mario Reyes • English"],["Add a new sensor","Scan QR code or enter device ID"],["Offline mode","Keep recent readings on this phone"],["Large text","Make words easier to read"],["Help & support","Guides, SMS help, and call support"],["Cooperative settings","Members, roles, and shared farms"]].map((x,i)=><button className="panel setting-item" key={x[0]}><span className="setting-icon">{i+1}</span><div><strong>{x[0]}</strong><span>{x[1]}</span></div>{i===2?<Status tone="offline">Ready</Status>:<Icon name="chevron"/>}</button>)}</div><div className="offline-banner"><span>Offline ready</span><strong>Weak signal? You can still see saved readings.</strong><p>When the connection returns, AgriSense will update automatically. Last synced today at 10:30 AM.</p></div></>;
}

function Cooperative() {
  return <><Header title="Cooperative overview" subtitle="12 member farms • San Isidro Farmers Cooperative"/><div className="report-grid">{[["Member farms","12","active"],["Sensors online","38 / 42","90%"],["Need attention","3","farms"]].map(x=><section className="panel stat" key={x[0]}><span>{x[0]}</span><strong>{x[1]} <small>{x[2]}</small></strong></section>)}</div><section className="panel coop-table"><div className="section-heading"><div><h2>Member farms</h2><p>Updated 5 minutes ago</p></div><Button kind="secondary">+ Add member</Button></div>{[["Reyes Family Farm","4 / 4","All good"],["Dela Cruz Rice Farm","5 / 6","Needs attention"],["Santos Vegetable Farm","3 / 3","All good"],["Garcia Farm","2 / 4","Critical"]].map((x,i)=><div className="table-row" key={x[0]}><span className="avatar">{x[0][0]}</span><strong>{x[0]}</strong><span>{x[1]} sensors</span><Status tone={i===3?"critical":i===1?"warn":"good"}>{x[2]}</Status><Icon name="chevron"/></div>)}</section></>;
}

function Irrigation({ go }: { go:(s:Screen)=>void }) {
  const [auto, setAuto] = useState(true); const [confirm,setConfirm]=useState(false); const [running,setRunning]=useState(false);
  return <><button className="back" onClick={()=>go("sensor")}>← Back to sensor</button><Header title="Irrigation control" subtitle="Field A • Pump connected and ready"/><div className="irrigation-grid"><section className="panel pump"><div className={`pump-visual ${running?"running":""}`}><span>≋</span></div><Status tone={running?"good":"offline"}>{running?"Pump is running":"Pump is off"}</Status><h2>{running?"Watering Field A":"Ready to water"}</h2><p>{running?"Started just now • Soil moisture 42%":"Last run yesterday for 24 minutes"}</p><Button kind={running?"danger":"primary"} onClick={()=>running?setRunning(false):setConfirm(true)}>{running?"Turn pump OFF":"Turn pump ON"}</Button></section><section className="panel control-settings"><h2>Irrigation mode</h2><div className="mode-toggle"><button onClick={()=>setAuto(false)} className={!auto?"active":""}>Manual</button><button onClick={()=>setAuto(true)} className={auto?"active":""}>Auto</button></div><div className="rule"><span>IF</span><div><strong>Soil moisture is below 30%</strong><small>Checked every 15 minutes</small></div></div><div className="rule"><span>THEN</span><div><strong>Run pump for 20 minutes</strong><small>Stop early if moisture reaches 45%</small></div></div><div className="schedule"><strong>Quiet hours</strong><span>Do not run between 10 PM and 5 AM</span><input type="checkbox" defaultChecked/></div></section></div>{confirm&&<div className="modal-wrap"><section className="modal"><button className="modal-close" onClick={()=>setConfirm(false)}><Icon name="close"/></button><span className="modal-icon">≋</span><h2>Turn on the water pump?</h2><p>Field A will be watered for up to 20 minutes. You can stop it anytime.</p><div><Button kind="secondary" onClick={()=>setConfirm(false)}>Cancel</Button><Button onClick={()=>{setRunning(true);setConfirm(false)}}>Yes, turn it on</Button></div></section></div>}</>;
}

function Onboarding({ done }: { done:()=>void }) {
  const [step,setStep]=useState(0); const [login,setLogin]=useState(false);
  const slides=[["Monitor your farm easily","See soil, water, and temperature readings in one simple place."],["Get SMS or chat updates","Know what your crops need—even when the internet is weak."],["Save water, electricity, and labor","Water only when your crops need it and spend less time checking fields."]];
  if(login) return <main className="auth"><section><button className="brand"><span className="brand-mark">A</span><span>AgriSense</span></button><span className="eyebrow">WELCOME BACK</span><h1>Let’s check your farm.</h1><p>Enter your phone number. We’ll send a one-time code by SMS.</p><label>Phone number<div className="phone-input"><span>+63</span><input placeholder="917 123 4567"/></div></label><Button onClick={done}>Send one-time code</Button><button className="join">Joining a cooperative? <strong>Enter invite code</strong></button></section><aside><FarmArt/><h2>Simple farm care, every day.</h2></aside></main>;
  return <main className="onboarding"><div className="onboard-top"><button className="brand"><span className="brand-mark">A</span><span>AgriSense</span></button><button className="language">English / Filipino</button></div><section><div className="onboard-art"><FarmArt/></div><div className="onboard-copy"><span className="step">0{step+1} / 03</span><h1>{slides[step][0]}</h1><p>{slides[step][1]}</p><div className="dots">{slides.map((_,i)=><i className={i===step?"active":""} key={i}/>)}</div><Button onClick={()=>step<2?setStep(step+1):setLogin(true)}>{step<2?"Continue":"Get started"} <Icon name="chevron"/></Button><button className="skip" onClick={()=>setLogin(true)}>Skip introduction</button></div></section></main>;
}

export default function App() {
  const [screen,setScreen]=useState<Screen>("home"); const [tour,setTour]=useState(false); const [alertSettings,setAlertSettings]=useState(false);
  if(tour) return <Onboarding done={()=>{setTour(false);setScreen("home")}}/>;
  const page = screen==="home"?<Dashboard go={setScreen}/>:screen==="fields"?<Fields go={setScreen}/>:screen==="sensor"?<SensorDetail go={setScreen}/>:screen==="irrigation"?<Irrigation go={setScreen}/>:screen==="alerts"?<Alerts settings={alertSettings} setSettings={setAlertSettings}/>:screen==="reports"?<Reports/>:screen==="cooperative"?<Cooperative/>:<Settings/>;
  return <div className="app-shell"><Sidebar screen={screen} go={setScreen}/><main className="content"><button className="tour-button" onClick={()=>setTour(true)}>View onboarding</button>{page}</main><BottomNav screen={screen} go={setScreen}/></div>;
}
