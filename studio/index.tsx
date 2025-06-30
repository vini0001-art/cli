import React, { useState } from "react";
import "./index.css"; // importar o CSS externo

function Preview({ code }: { code: string }) {
  // TODO: Adicionar lógica de transpiler aqui futuramente
  return (
    <div className="preview-container">
      <strong>Preview:</strong>
      <pre>{code}</pre>
    </div>
  );
}

export default function Studio() {
  const [code, setCode] = useState("// Digite seu .s4ft aqui");
  return (
    <div>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Digite seu código .s4ft aqui"
        aria-label="Editor de código .s4ft"
      />
      <div>
        <Preview code={code} />
      </div>
    </div>
  );
}
