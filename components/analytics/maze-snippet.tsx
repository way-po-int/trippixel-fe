import Script from "next/script";

export function MazeSnippet() {
  return (
    <Script id="maze-snippet" strategy="afterInteractive">
      {`
        (function (m, a, z, e) {
          var s, t, u, v;
          try {
            t = m.sessionStorage.getItem('maze-us');
          } catch (err) {}

          if (!t) {
            t = new Date().getTime();
            try {
              m.sessionStorage.setItem('maze-us', t);
            } catch (err) {}
          }

          u = document.currentScript || (function () {
            var w = document.getElementsByTagName('script');
            return w[w.length - 1];
          })();
          v = u && u.nonce;

          s = a.createElement('script');
          s.src = z + '?apiKey=' + e;
          s.async = true;
          if (v) s.setAttribute('nonce', v);
          a.getElementsByTagName('head')[0].appendChild(s);
          m.mazeUniversalSnippetApiKey = e;
        })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'c12b1af2-6e6f-4b3b-914d-73a15b2d620b');
      `}
    </Script>
  );
}
