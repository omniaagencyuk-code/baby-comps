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
          background: '#fff8f4',
          color: '#3b3026',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div>
          <div style={{ fontSize: 48 }}>🧸</div>
          <h1 style={{ marginTop: 16 }}>Something went wrong</h1>
          <p style={{ color: '#6a5d50' }}>Please try again in a moment.</p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '10px 20px',
              borderRadius: 9999,
              border: 'none',
              background: '#825621',
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
