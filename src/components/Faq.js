import React from 'react';

const faqQuestions = [
  { title: 'What Is Instant?', desc: 'Peer to peer file sharing.' },
  { title: 'How much does Insant cost?', desc: 'Insant is completely free for life.' },
];

export default function Faq() {
  return (<div className="text-uppercase ltsp2 mt-5 mb-5">
    <div className="b-title">
      <h3>asked questions</h3>
    </div>
    {faqQuestions.map((q, i) => <details key={i} className="mb-2">
      <summary className="bg-yellow mb-1 cp">{q.title}</summary>
      <h5 className="p-10 m-0 bg-white">{q.desc}</h5>
    </details>)}
  </div>);
}