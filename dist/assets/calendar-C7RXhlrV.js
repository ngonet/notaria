const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-qaeIHctu.js","assets/index-CQYbnaze.js","assets/calendar-api-DI4JFgY3.js","assets/site-DrCzpknc.js"])))=>i.map(i=>d[i]);
import{_ as p}from"./index-ChiRzVv2.js";import{s}from"./site-DrCzpknc.js";function y(r){const{eyebrow:d,heading:i,lead:l,loadingLabel:c,reservationNote:m}=s.calendar;r.innerHTML=`
    <div class="border-t border-line bg-surface">
      <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
        <header class="mx-auto max-w-3xl text-center">
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${d}</p>
          <h2 id="calendario-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">${i}</h2>
          <p class="mt-4 text-base text-muted md:text-lg">${l}</p>
        </header>

        <div
          class="mt-12 min-h-[420px] rounded-card border border-line bg-bg p-4 shadow-card md:p-6"
          data-calendar-root
          aria-busy="true"
        >
          <p class="flex h-72 items-center justify-center text-sm text-muted" data-calendar-loading>
            ${c}
          </p>
        </div>

        <p class="mt-6 text-center text-xs text-muted">
          ${m.beforePhone}
          <a class="font-semibold text-navy hover:underline" href="tel:${s.contact.phoneE164}">${s.contact.phoneDisplay}</a>
          ${m.afterPhone}
        </p>
      </div>
    </div>
  `;const t=r.querySelector("[data-calendar-root]");if(!t)return;const o=new IntersectionObserver(async a=>{a.some(e=>e.isIntersecting)&&(o.disconnect(),await u(t))},{rootMargin:"200px"});o.observe(t)}async function u(r){const d=r.querySelector("[data-calendar-loading]");try{const[{Calendar:i},l,{fetchCalendarEvents:c}]=await Promise.all([p(()=>import("./index-CQYbnaze.js").then(t=>t.U),[]),p(()=>import("./index-qaeIHctu.js"),__vite__mapDeps([0,1])),p(()=>import("./calendar-api-DI4JFgY3.js"),__vite__mapDeps([2,3]))]);d?.remove(),r.removeAttribute("aria-busy"),new i(r,{plugins:[l.default],initialView:"dayGridMonth",locale:"es",firstDay:1,height:"auto",headerToolbar:{left:"prev,next today",center:"title",right:""},buttonText:{today:s.calendar.todayLabel},events:async(t,o,a)=>{try{const n=await c(t.startStr,t.endStr);o(n.map(e=>({id:e.id,title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay,classNames:[`notaria-calendar-event--${e.kind}`],extendedProps:{kind:e.kind}})))}catch(n){a(n)}},eventDisplay:"block",displayEventEnd:!0,eventTimeFormat:{hour:"2-digit",minute:"2-digit",hour12:!1},eventContent:t=>{const o=t.event.extendedProps.kind,a=document.createElement("span");a.className="notaria-calendar-event__content";const n=document.createElement("span");if(n.className="notaria-calendar-event__title",n.textContent=t.event.title,a.append(n),o==="attention"&&t.timeText){const e=document.createElement("span");e.className="notaria-calendar-event__time",e.textContent=t.timeText.replace(" - ","–"),a.append(e)}return{domNodes:[a]}}}).render()}catch(i){console.error("[notaria] calendar failed to load",i),d&&(d.textContent=s.calendar.errorMessage),r.removeAttribute("aria-busy")}}export{y as mountCalendar};
