// Personnages originaux vectoriels : animation locale, sans dépendance réseau.
import { esc } from './util.js';
const roster = {
 gates: ['Veyra', 'Sentinelle des portes', '#ff526c', 'knight'],
 powers: ['Nyx', 'Tisseur des ombres', '#b58aff', 'insect'],
 guild: ['Ordan', 'Gardien du savoir', '#f1d18c', 'mentor'],
 chamber: ['Kaël', 'Forgeur de volonté', '#ffc457', 'titan'],
 status: ['Nyx', 'Votre ombre veille', '#b58aff', 'insect']
};
export function guardian(tab, compact = false) {
 const [name, title, color, kind] = roster[tab] || roster.status;
 const head = kind === 'mentor' ? '<path d="M-19-154Q-24-187 0-187Q26-185 19-154L12-140H-12Z" fill="#b5b6c4"/><path d="M-17-166L-12-144 0-137 14-145 18-169" fill="#927c75"/>' : kind === 'insect' ? '<path d="M-22-154L-38-198-13-181 0-207 13-181 38-198 22-154 0-137Z"/>' : kind === 'titan' ? '<path d="M-24-153L-34-176-18-174-8-194 5-181 21-190 27-161 17-140H-16Z" fill="#c69548"/>' : '<path d="M-19-148L-24-173 0-195 24-173 19-148 0-135Z"/><path class="guardian-plume" d="M0-188Q16-242 53-205Q14-215 22-169" fill="currentColor"/>';
 const torso = kind === 'titan' ? '<path d="M-22-143L-49-130-56-84-38-75-25-110-22-66H22L25-110 38-75 56-84 49-130 22-143 0-125Z" fill="#694537"/><path d="M-30-128L-12-111-26-98M30-128L12-111 26-98M-20-88H20" class="guardian-rune"/>' : '<path d="M-18-141L-45-129-57-113-37-107-27-71 0-63 27-71 37-107 57-113 45-129 18-141 0-122Z"/><path class="guardian-rune" d="M-34-123L0-108 34-123M-25-99L0-87 25-99M-18-76L0-70 18-76"/>';
 return `<figure class="guardian ${compact ? 'compact' : ''}" style="--guardian:${color}"><svg viewBox="-110 -240 220 270" aria-hidden="true"><ellipse class="guardian-ring" cy="12" rx="92" ry="12"/><g class="guardian-float"><path class="guardian-cape" d="M-29-135Q-68-80-83 6L-42-8-24 10 0-54 31 10 53-7 82 6Q65-92 29-135Z"/>${kind === 'insect' ? '<path class="guardian-wings" d="M-25-118L-91-176-69-65-33-37M25-118L91-176 69-65 33-37"/>' : ''}<g class="guardian-plate">${head}${torso}<path d="M-24-69L-29-28-36 5H-10L0-49 10 5H36L29-28 24-69 0-58Z"/><path d="M-42-108L-51-65-43-51-31-66-30-99M42-108L51-65 43-51 31-66 30-99"/></g><path class="guardian-eyes" d="M-14-160L-4-156M14-160L4-156"/>${kind === 'knight' ? '<path class="guardian-sword" d="M-51-70L-58 14-65 24-65 12-59-70M-70-69H-42"/>' : ''}${kind === 'mentor' ? '<path class="guardian-rune" d="M0-126V-76M-15-135L0-115 15-135"/>' : ''}<path class="guardian-energy" d="M-67 0Q-90-43-61-75M67 0Q90-43 61-75"/></g></svg><figcaption><b>${name}</b><span>${title}</span></figcaption></figure>`;
}
export function radar(stats, names) {
 const keys=Object.keys(names), max=Math.max(10,...keys.map(k=>stats[k]||0));
 const point=(i,r)=>{const a=i*2*Math.PI/keys.length-Math.PI/2;return [150+Math.cos(a)*r,140+Math.sin(a)*r];};
 const poly=r=>keys.map((_,i)=>point(i,r).join(',')).join(' ');
 return `<svg class="stat-radar" viewBox="0 0 300 290" role="img" aria-label="Répartition des compétences, échelle relative : maximum ${max}">${[25,50,75,100].map(r=>`<polygon points="${poly(r)}" class="radar-grid"/>`).join('')}${keys.map((k,i)=>`<path d="M150 140L${point(i,100).join(' ')}" class="radar-grid"/>`).join('')}<polygon class="radar-value" points="${keys.map((k,i)=>point(i,100*(stats[k]||0)/max).join(',')).join(' ')}"/>${keys.map((k,i)=>{const [x,y]=point(i,122);return `<text x="${x}" y="${y}" text-anchor="middle">${esc(names[k])}</text>`;}).join('')}</svg>`;
}
