'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-GB">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fbf8f3',
          color: '#3a302b',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div>
          <div style={{ fontSize: 48 }}>🧸</div>
          <h1 style={{ marginTop: 16 }}>Something went wrong</h1>
          <p style={{ color: '#6e5e52' }}>Please try again in a moment.</p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '10px 20px',
              borderRadius: 9999,
              border: 'none',
              background: '#916c58',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
