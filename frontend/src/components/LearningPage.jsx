import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { learningAPI } from "../services/api";
import "../styles/LearningPage.css";

function LearningPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("How creators can use a content calendar");
  const [audience, setAudience] = useState("early-stage creators");
  const [tone, setTone] = useState("practical and encouraging");
  const [draft, setDraft] = useState(null);
  const [aiError, setAiError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [eventLoopOutput, setEventLoopOutput] = useState([]);
  const [hoistingOutput, setHoistingOutput] = useState("");
  const [sqlRows, setSqlRows] = useState([]);
  const [sqlError, setSqlError] = useState("");

  const generateDraft = async (event) => {
    event.preventDefault();
    setIsGenerating(true);
    setAiError("");
    try {
      const response = await learningAPI.generateDraft(topic, audience, tone);
      setDraft(response.data.draft);
    } catch (error) {
      setAiError(error.response?.data?.message || "Could not generate a draft.");
    } finally {
      setIsGenerating(false);
    }
  };

  const runEventLoopDemo = () => {
    const output = ["1. synchronous code"];
    setEventLoopOutput(output);
    Promise.resolve().then(() => setEventLoopOutput((items) => [...items, "3. promise microtask"]));
    setTimeout(() => setEventLoopOutput((items) => [...items, "4. timer task"]), 0);
    setEventLoopOutput((items) => [...items, "2. end of synchronous code"]);
  };

  const runHoistingDemo = () => {
    function declarationExample() {
      return "function declarations are hoisted";
    }
    let declarationResult;
    try {
      declarationResult = declarationExample();
      {
        const readBeforeInitialization = () => temporalValue;
        readBeforeInitialization();
        let temporalValue = "initialized";
        declarationResult += `; let is available after initialization (${temporalValue})`;
      }
    } catch (error) {
      declarationResult += `; let is unavailable before initialization (${error.name})`;
    }
    setHoistingOutput(declarationResult);
  };

  const runSqlJoin = async () => {
    setSqlError("");
    try {
      const response = await learningAPI.getSqlPostsWithAuthors();
      setSqlRows(response.data.rows);
    } catch (error) {
      setSqlError(error.response?.data?.message || "Start PostgreSQL with Docker Compose to run this JOIN.");
    }
  };

  return (
    <main className="learning-page">
      <header className="learning-header">
        <button className="text-button" onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <p className="learning-kicker">Creators Hub lab</p>
        <h1>Build the idea, understand the machinery.</h1>
        <p>Runnable notes on AI APIs, JavaScript execution, and relational data.</p>
      </header>

      <section className="learning-grid">
        <article className="learning-panel ai-panel">
          <div className="panel-heading"><span className="panel-number">01</span><h2>Gemini post studio</h2></div>
          <p className="panel-note">Prompt engineering feeds a typed JSON contract, so the UI receives a predictable draft.</p>
          <form onSubmit={generateDraft} className="draft-form">
            <label>Topic<input value={topic} onChange={(event) => setTopic(event.target.value)} /></label>
            <label>Audience<input value={audience} onChange={(event) => setAudience(event.target.value)} /></label>
            <label>Tone<input value={tone} onChange={(event) => setTone(event.target.value)} /></label>
            <button className="primary-button" disabled={isGenerating}>{isGenerating ? "Generating..." : "Generate draft"}</button>
          </form>
          {aiError && <p className="inline-error">{aiError}</p>}
          {draft && <div className="result-box"><h3>{draft.title}</h3><p>{draft.content}</p><p className="keywords">{draft.keywords.join(" · ")}</p></div>}
        </article>

        <article className="learning-panel">
          <div className="panel-heading"><span className="panel-number">02</span><h2>JavaScript behavior</h2></div>
          <p className="panel-note">Observe the event loop and hoisting directly in the browser.</p>
          <button className="secondary-button" onClick={runEventLoopDemo}>Run event loop</button>
          <div className="console-box">{eventLoopOutput.length ? eventLoopOutput.map((item) => <div key={item}>{item}</div>) : "Output appears here"}</div>
          <button className="secondary-button" onClick={runHoistingDemo}>Run hoisting</button>
          <div className="console-box">{hoistingOutput || "Output appears here"}</div>
        </article>

        <article className="learning-panel sql-panel">
          <div className="panel-heading"><span className="panel-number">03</span><h2>Relational model</h2></div>
          <p className="panel-note">Authors and posts use primary keys, foreign keys, and an INNER JOIN. Start the included PostgreSQL service to query it.</p>
          <pre>{"authors (id PK)  ←  posts (author_id FK)"}</pre>
          <button className="secondary-button" onClick={runSqlJoin}>Run INNER JOIN</button>
          {sqlError && <p className="inline-error">{sqlError}</p>}
          {sqlRows.map((row) => <div className="sql-row" key={row.id}><strong>{row.title}</strong><span>by {row.author_name}</span></div>)}
        </article>
      </section>
    </main>
  );
}

export default LearningPage;