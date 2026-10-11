import os
HERE = os.path.dirname(os.path.abspath(__file__))
import json, os, sys, collections
R=os.path.join(HERE, 'research')
OUT=os.path.join(HERE, '..', 'data')
TH=['builders-1','builders-2','researchers-1','researchers-2','investors-1','investors-2']
CX=['context-1','context-2']
LAYERS={'energy','semis','cloud','data','architecture','training','inference','models','platforms','agents','apps','distribution','economics','society'}
TOPICS={'scaling','architecture','post-training','reasoning','data','open-weights','infra-cycle','commoditization','hyperscalers','agents','coding','app-moats','enterprise-roi','labor','agi-timelines','safety','value-accrual'}
warn=collections.Counter(); notes=[]
ev={}; thinkers=[]; asr=[]; rel=[]; events=[]; periods=[]; metrics=[]; gaps={}
def W(m): warn[m]+=1
def add_ev(e, src):
    i=e['id']
    if i in ev:
        if ev[i].get('url')==e.get('url') and ev[i].get('passage')==e.get('passage'): return i
        ni=f"{i}-{src}"; notes.append(f"evidence id collision {i} -> {ni}"); e=dict(e,id=ni); i=ni
    ev[i]=e; return i
for f in TH+CX:
    d=json.load(open(f'{R}/{f}.json'))
    gaps[f]=d.get('gaps',[])
    remap={}
    for e in d.get('evidence',[]):
        old=e['id']; new=add_ev(e,f)
        if new!=old: remap[old]=new
    rm=lambda ids:[remap.get(x,x) for x in (ids or [])]
    for t in d.get('thinkers',[]):
        for m in t.get('mentalModel',[]): m['evidenceIds']=rm(m.get('evidenceIds'))
        for r in t.get('reversals',[]): r['evidenceIds']=rm(r.get('evidenceIds'))
        thinkers.append(t)
    for a in d.get('assertions',[]):
        a['evidenceIds']=rm(a.get('evidenceIds')); a['outcomeEvidenceIds']=rm(a.get('outcomeEvidenceIds'))
        a['_src']=f; asr.append(a)
    for r in d.get('relations',[]):
        r['evidenceIds']=rm(r.get('evidenceIds')); r['id']=f"{f}-{r['id']}"; rel.append(r)
    for x in d.get('events',[]): x['evidenceIds']=rm(x.get('evidenceIds')); events.append(x)
    for x in d.get('periods',[]): x['evidenceIds']=rm(x.get('evidenceIds')); periods.append(x)
    for x in d.get('metrics',[]):
        for p in x.get('points',[]): p['evidenceId']=remap.get(p.get('evidenceId'),p.get('evidenceId'))
        metrics.append(x)
# normalize
tids={t['id'] for t in thinkers}
print('thinkers',len(thinkers),sorted(tids) if len(tids)!=30 else '')
for e in ev.values():
    e.setdefault('url',''); e.setdefault('note','')
    if e.get('verification') not in ('fetched','snippet','recalled'): W('bad verification'); e['verification']='recalled'
    if e['verification']=='recalled' and e.get('verbatim'): e['verbatim']=False; W('recalled verbatim->false')
    e['date']=str(e.get('date',''))
    if e['date']>'2026-10-11': W('evidence after cutoff '+e['id']); notes.append('post-cutoff evidence '+e['id']+' '+e['date'])
VERD={'correct','partial','incorrect','unresolved'}
seen=set()
for a in asr:
    if a['id'] in seen: a['id']=a['id']+'-'+a['_src']; W('dup assertion id')
    seen.add(a['id'])
    if a['thinkerId'] not in tids: W('unknown thinker '+a['thinkerId'])
    a['layers']=[l for l in a.get('layers',[]) if l in LAYERS] or ['society']
    bad=[t for t in a.get('topics',[]) if t not in TOPICS]
    if bad: W('bad topics'); notes.append(f"{a['id']} dropped topics {bad}")
    a['topics']=[t for t in a.get('topics',[]) if t in TOPICS]
    if a.get('verdict') not in VERD: W('bad verdict '+str(a.get('verdict'))); a['verdict']='unresolved'
    if a.get('timing') not in ('early','on-time','late','premature','n/a'): a['timing']='n/a'
    if a.get('kind') not in ('prediction','opinion','aspiration','conditional','action'): W('bad kind '+str(a.get('kind'))); a['kind']='opinion'
    if a.get('category') not in ('technical','economic','market','adoption','governance'): W('bad cat '+str(a.get('category'))); a['category']='market'
    if a.get('confidence') not in ('high','medium','low'): a['confidence']='low'
    for k in ('originality','specificity'):
        v=a.get(k); a[k]=int(v) if isinstance(v,(int,float)) else 3
    if a['verdict']=='unresolved': a['causal']=None
    elif not isinstance(a.get('causal'),(int,float)): a['causal']=None
    a['date']=str(a['date'])
    if a['date']>'2026-10-11': W('assertion after cutoff'); notes.append('post-cutoff assertion '+a['id'])
    for k in ('assumptions','evidenceIds','outcomeEvidenceIds'): a.setdefault(k,[])
    for k in ('horizon','predictedOutcome','contextAtTime','outcome','verdictRationale','evolution'): a[k]=a.get(k) or ''
    a.setdefault('horizonDate',None); a.setdefault('claimIsQuote',False)
    for i in a['evidenceIds']+a['outcomeEvidenceIds']:
        if i not in ev: W('missing evidence ref'); notes.append(f"{a['id']} missing {i}")
    a['evidenceIds']=[i for i in a['evidenceIds'] if i in ev]; a['outcomeEvidenceIds']=[i for i in a['outcomeEvidenceIds'] if i in ev]
    del a['_src']
for r in rel:
    for k in ('from',):
        if r[k] not in tids: W('rel unknown from')
    r.setdefault('inferred',False); r['date']=str(r.get('date','')); r['evidenceIds']=[i for i in r['evidenceIds'] if i in ev]
import re
for t in thinkers:
    mm=[]
    for m in t.get('mentalModel',[]):
        m['evidenceIds']=[i for i in m['evidenceIds'] if i in ev]
        s_=m['summary']
        # Research-process notes are not beliefs: drop "no statement found" entries, flag recalled ones.
        if re.match(r'(?i)^no (dated|new) ', s_): notes.append(f"dropped meta mentalModel {t['id']} {m['period']}"); continue
        if re.match(r'(?i)^recalled, low confidence:\s*', s_) or re.search(r'(?i)\s*\(recalled, not re-verified\)', s_):
            s_=re.sub(r'(?i)^recalled, low confidence:\s*','',s_); s_=re.sub(r'(?i)\s*\(recalled, not re-verified\)','',s_)
            m['unverified']=True
        m['summary']=s_[0].upper()+s_[1:] if s_ else s_
        mm.append(m)
    t['mentalModel']=mm
    t.setdefault('reversals',[]); t.setdefault('corpusNotes','')
for x in events+periods: x['evidenceIds']=[i for i in x.get('evidenceIds',[]) if i in ev]
for x in events: x['layers']=[l for l in x.get('layers',[]) if l in LAYERS]
def scrub(o):
    # Research-process wording ("this session") -> reader-facing wording.
    if isinstance(o,str): return re.sub(r'(?i)\bthis session\b','during research',o)
    if isinstance(o,list): return [scrub(x) for x in o]
    if isinstance(o,dict): return {k:scrub(v) for k,v in o.items()}
    return o
thinkers=scrub(thinkers); asr=scrub(asr); rel=scrub(rel); events=scrub(events); periods=scrub(periods); metrics=scrub(metrics)
ev={k:scrub(v) for k,v in ev.items()}
json.dump(thinkers,open(f'{OUT}/thinkers.json','w'),indent=1,ensure_ascii=False)
json.dump(list(ev.values()),open(f'{OUT}/evidence.json','w'),indent=1,ensure_ascii=False)
json.dump(asr,open(f'{OUT}/assertions.json','w'),indent=1,ensure_ascii=False)
json.dump(rel,open(f'{OUT}/relations.json','w'),indent=1,ensure_ascii=False)
json.dump(events,open(f'{OUT}/events.json','w'),indent=1,ensure_ascii=False)
json.dump(periods,open(f'{OUT}/periods.json','w'),indent=1,ensure_ascii=False)
mm={}
for x in metrics:
    if x['id'] in mm:
        have={p['date'] for p in mm[x['id']]['points']}
        mm[x['id']]['points']+= [p for p in x['points'] if p['date'] not in have]
        mm[x['id']]['caveat']=(mm[x['id']].get('caveat','')+' '+x.get('caveat','')).strip()
    else: mm[x['id']]=x
for x in mm.values(): x['points'].sort(key=lambda p:p['date'])
metrics=list(mm.values())
json.dump(metrics,open(f'{OUT}/metrics.json','w'),indent=1,ensure_ascii=False)
json.dump(gaps,open(os.path.join(HERE, 'research', 'gaps.json'),'w'),indent=1,ensure_ascii=False)
print('evidence',len(ev),collections.Counter(e['verification'] for e in ev.values()), 'with url',sum(1 for e in ev.values() if e['url']))
print('assertions',len(asr),collections.Counter(a['verdict'] for a in asr))
print('relations',len(rel),'events',len(events),'periods',[p['id'] for p in periods],'metrics',len(metrics))
print('warnings',dict(warn)); print('\n'.join(notes[:40]))
pc=collections.Counter(a['thinkerId'] for a in asr); print(dict(pc))
