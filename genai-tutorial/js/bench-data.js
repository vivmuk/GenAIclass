/* Benchmark snapshots — each carries its own source date on purpose. */
window.CHUTNEY_BENCH = {
  hle: {
    name: "Humanity's Last Exam",
    desc: "2,500 expert-written questions across maths, science and the humanities. No tools. Higher is better; the top of this board is still under 50%.",
    unit: "%",
    source: "Source: Scale AI leaderboard via LM Council · results snapshot 14 Jun 2026 · checked 18 Aug 2026",
    rows: [
      ["Gemini 3.1 Pro (high thinking)", 46.4],
      ["GPT-5.4 Pro", 44.3],
      ["Muse Spark", 40.6],
      ["Gemini 3 Pro Preview", 37.5],
      ["GPT-5.4 (xhigh)", 36.2]
    ]
  },
  swe: {
    name: "SWE-bench Verified",
    desc: "500 real GitHub issues. The model edits a repository and the fix is judged by the project's own tests.",
    unit: "%",
    source: "Source: Epoch AI via LM Council · snapshot 18 Aug 2026",
    rows: [
      ["Claude Opus 4.7 (max)", 83.5],
      ["GPT-5.5 (xhigh)", 80.6],
      ["Gemini 3.5 Flash (high)", 79.3],
      ["Claude Opus 4.6 (no thinking)", 78.7],
      ["GLM 5.2 (max)", 78.7]
    ]
  },
  gpqa: {
    name: "GPQA Diamond",
    desc: "198 PhD-level science questions written to be answerable by domain experts and not by search. Random guessing gets you 25%.",
    unit: "%",
    source: "Source: Epoch AI via LM Council · snapshot 18 Aug 2026",
    rows: [
      ["GPT-5.4 Pro (xhigh)", 94.6],
      ["Gemini 3.1 Pro Preview", 94.1],
      ["GPT-5.5 (xhigh)", 94.0],
      ["GPT-5.5 Pro (xhigh)", 93.9],
      ["GPT-5.4 (xhigh)", 93.3]
    ]
  },
  simple: {
    name: "SimpleBench",
    desc: "Trick questions that punish memorised answers. It measures whether a model has common sense when the obvious answer is wrong.",
    unit: "%",
    source: "Source: SimpleBench via LM Council · snapshot 13 Aug 2026",
    rows: [
      ["Claude Fable 5", 81.9],
      ["Claude Opus 5", 80.6],
      ["Gemini 3.1 Pro Preview", 79.6],
      ["GPT-5.5 Pro", 76.9],
      ["Gemini 3.5 Flash", 76.7]
    ]
  },
  terminal: {
    name: "Terminal-Bench 4.0",
    desc: "Long, multi-step professional work inside a command line. This is the closest public proxy for an agent doing a real job.",
    unit: "%",
    source: "Source: Anthropic model card for Claude Opus 5.5 · 22 Sep 2026. GPT-6 Astra figure as reported by OpenAI.",
    rows: [
      ["Claude Opus 5.5 (xhigh)", 66.4],
      ["GPT-6 Astra (high)", 57.9],
      ["Claude Fable 5.1", 55.8],
      ["Claude Opus 5", 52.3]
    ]
  }
};
