export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem("vaulte-theme");
              if (theme === "light") {
                document.documentElement.classList.remove("dark");
              }
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
