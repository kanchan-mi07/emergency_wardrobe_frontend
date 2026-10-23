// Two-column layout shared by Login and Signup: brand artwork on the left, form on the right.
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="ew-auth">
      <aside className="ew-auth-art">
        <h2>Always ready, whatever the occasion.</h2>
        <p>Buy, rent or grab a rescue kit — in minutes, not hours.</p>
      </aside>
      <main className="ew-auth-main">
        <div className="ew-auth-card">
          <h1>{title}</h1>
          <p className="text-muted mb-4">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  )
}

export default AuthLayout