function App() {
  return (
    <>
      {/* 상단 고정 메뉴바 */}
      <header className="fixed top-0 left-0 w-full bg-transparent z-50 flex justify-center">
        <div className="bg-amber-100 max-w-7xl w-full flex justify-between items-center p-6">
          {/* 왼쪽 메뉴 */}
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/jflower52"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500"
            >
              GitHub
            </a>
            <a
              href="https://velog.io/@jflower/posts"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500"
            >
              Velog
            </a>
          </div>

          {/* 오른쪽 메뉴 */}
          <div className="flex items-center gap-8">
            <a href="#about" className="hover:text-yellow-500">
              About Me
            </a>
            <a href="#projects" className="hover:text-yellow-500">
              Projects
            </a>
          </div>
        </div>
      </header>

      {/* 섹션 */}
      <section></section>
      <section></section>
      <section></section>

      {/* 푸터 */}
      <footer></footer>
    </>
  );
}

export default App;
