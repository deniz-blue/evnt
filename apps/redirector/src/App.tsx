export const App = ({ failed }: { failed: boolean }) => {
  return (
    <>
      {failed ? (
        <div>
          <h1>Instance URL Not Set</h1>
          <p>
            The instance URL is not set. Please set it using the <code>setInstanceUrl</code> query parameter.
          </p>
          <p>
            Example: <code>?setInstanceUrl=https://example.com/redirector</code>
          </p>
        </div>
      ) : (
        <div>
          <h1>Event Redirector</h1>
          <p>
            The instance URL is set. You can now use the redirector functionality.
          </p>
        </div>
      )}
    </>
  )
}
