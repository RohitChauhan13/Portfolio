export function AppLoader() {
  return (
    <div className="app-loader-screen" role="status" aria-label="Loading">
      <div className="loader" aria-hidden="true">
        <span>
          <span />
          <span />
          <span />
          <span />
        </span>
        <div className="base">
          <span />
          <div className="face" />
        </div>
      </div>
      <div className="longfazers" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
