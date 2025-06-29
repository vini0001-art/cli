import React, { useState } from "react";

function Preview({ code }: { code: string }) {
  // TODO: Adicionar lógica de transpiler aqui futuramente
  return (
    <div style={{ marginTop: 16, background: "#f5f5f5", padding: 8 }}>
      <strong>Preview:</strong>
      <pre>{code}</pre>
    </div>
  );
}

export default function Studio() {
  const [code, setCode] = useState("// Digite seu .s4ft aqui");
  return (
    <div>
      <textarea value={code} onChange={e => setCode(e.target.value)} />
      <div>
        <Preview code={code} />
      </div>
    </div>
  );
}