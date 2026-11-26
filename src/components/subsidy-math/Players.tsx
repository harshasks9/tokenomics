import { Tag } from "./ui";

const WORDS: { term: string; plain: string }[] = [
  { term: "Hyperscaler / cloud", plain: "A giant company that rents out computers by the minute — Amazon (AWS), Microsoft (Azure), Google (Google Cloud)." },
  { term: "Model maker", plain: "The company that builds the AI brain — Anthropic (Claude), OpenAI (GPT), Google DeepMind (Gemini)." },
  { term: "Tokens & list price", plain: "AI is sold by the word-piece (“token”). The list price is the price on the menu, before any deal." },
  { term: "Discount vs credit", plain: "A discount lowers the price every time. A credit is free money to spend — often only once." },
  { term: "Principal vs agent", plain: "The principal is the real seller who sets the price. The agent just runs the till and keeps a fee." },
  { term: "Take-or-pay commitment", plain: "A promise to spend a minimum amount, used or not — like a phone contract." },
  { term: "Contribution", plain: "What is left for the cloud after paying the model maker, the chips, power and the people selling it." },
  { term: "Payback", plain: "How long until the profit from a customer repays the coupon used to win them." },
];

/** Section: the cast and the vocabulary, in plain words. */
export default function Players() {
  return (
    <>
      <div className="sm-grid c3">
        <div className="sm-card">
          <h3><span className="sm-dot" style={{ background: "var(--aws)" }} />AWS sells Claude</h3>
          <p>Think of AWS as a giant shopping mall. Claude is a famous restaurant inside it. When you buy a Claude meal at the AWS mall, <b>Anthropic is the restaurant</b> — it sets the menu price — and AWS runs the till and keeps a fee <Tag b="D" />. Anthropic also rents its kitchen (the chips) from the mall.</p>
        </div>
        <div className="sm-card">
          <h3><span className="sm-dot" style={{ background: "var(--msft)" }} />Microsoft sells OpenAI</h3>
          <p>Microsoft owns a big slice of OpenAI and, since April 2026, a <b>royalty-free licence</b> to OpenAI&apos;s models until 2032 <Tag b="R" />. So when Azure sells an OpenAI model it is mostly selling <i>its own</i> product — more like a store brand than a rented restaurant.</p>
        </div>
        <div className="sm-card">
          <h3><span className="sm-dot" style={{ background: "var(--google)" }} />Google sells Gemini — and Claude</h3>
          <p>Google builds Gemini itself and runs it on its own TPU chips: no fee to anyone. But building Gemini costs billions, which Google books outside its cloud results <Tag b="D" />. Google <i>also</i> sells Claude — on exactly the same &ldquo;run the till, keep a fee&rdquo; terms as AWS.</p>
        </div>
      </div>
      <h3 style={{ marginTop: 28 }}>Eight words you need</h3>
      <div className="sm-grid c4">
        {WORDS.map((w) => (
          <div key={w.term} className="sm-card" style={{ padding: 14 }}>
            <b style={{ fontSize: 14.5 }}>{w.term}</b>
            <p style={{ fontSize: 14, margin: "4px 0 0" }}>{w.plain}</p>
          </div>
        ))}
      </div>
      <p className="sm-caveat" style={{ marginTop: 16 }}>
        Badges tell you how sure we are: <Tag b="D" /> came from a company filing, <Tag b="R" /> is a company statement or credible press report, <Tag b="C" /> is our arithmetic on those, and <Tag b="A" /> is an assumption you can change.
      </p>
    </>
  );
}
