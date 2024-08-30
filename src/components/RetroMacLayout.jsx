import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function RetroMacLayout({
  children,
  isAuthenticated,
  onLogin,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  RetroMacLayout.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
  }

  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      <nav className="bg-stripes h-16 flex items-center justify-between px-4 text-black">
        <div className="text-xl font-bold retro-font">Nexus Scholar</div>
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <Link
                to="/start"
                className="hover:bg-black hover:text-white px-2 py-1"
              >
                Start
              </Link>
              <Link
                to="/contextBuilder"
                className="hover:bg-black hover:text-white px-2 py-1"
              >
                Context Builder
              </Link>
              <Link
                to="/chatHistory"
                className="hover:bg-black hover:text-white px-2 py-1"
              >
                Chat History
              </Link>
              <Link
                to="/account"
                className="hover:bg-black hover:text-white px-2 py-1"
              >
                Account
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="bg-black text-white font-bold py-1 px-3 rounded border-2 border-gray-700 hover:bg-gray-800 retro-font text-xs"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="bg-black text-white font-bold py-1 px-3 rounded border-2 border-gray-700 hover:bg-gray-800"
            >
              Log In / Sign up
            </button>
          )}
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white border-b-2 border-gray-300">
          {isAuthenticated && (
            <>
              <Link to="/start" className="block px-4 py-2 hover:bg-gray-100">
                Start
              </Link>
              <Link
                to="/contextBuilder"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Context Builder
              </Link>
              <Link
                to="/chatHistory"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Chat History
              </Link>
              <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">
                Account
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Log In / Sign up
            </button>
          )}
        </div>
      )}

      <main className="flex-grow p-4 overflow-auto w-full">{children}</main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        :root {
          --mac-platinum: #e2e5e7;
          --mac-gray: #a7a8aa;
          --mac-purple: #af52de;
          --mac-purple-dark: #8033a1;
          --mac-beige: #f3e5ab;
          --mac-warm-gray: #b4a89e;
          --mac-cool-gray: #a0a7b4;
          --mac-muted-green: #c0dcce;
          --mac-red: #ff0000;
        }

        .retro-font {
          font-family: 'Press Start 2P', cursive;
        }

        .retro-text {
          font-family: 'VT323', monospace;
          font-size: 1.1rem;
        }
        .retro-text-light {
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.95rem;
          line-height: 1.2;
        }

        p.retro-text {
          font-weight: 300 !important;
        }

        .bg-stripes {
          background-image: repeating-linear-gradient(
            0deg,
            #ffffff,
            #ffffff 2px,
            #d4d4d4 2px,
            #d4d4d4 4px
          );
        }

        .shadow-inner {
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        }

        .bg-mac-platinum {
          background-color: var(--mac-platinum);
        }
        .bg-mac-purple {
          background-color: var(--mac-purple);
        }
        .bg-mac-beige {
          background-color: var(--mac-beige);
        }
        .bg-mac-gray {
          background-color: var(--mac-gray);
        }
        .bg-mac-warm-gray {
          background-color: var(--mac-warm-gray);
        }
        .bg-mac-cool-gray {
          background-color: var(--mac-cool-gray);
        }
        .bg-mac-muted-green {
          background-color: var(--mac-muted-green);
        }

        .bg-mac-red {
          background-color: var(--mac-red);
        }
        .bg-mac-red-dark {
          background-color: var(--mac-red-dark);
        }
        .bg-mac-purple-dark {
          background-color: var(--mac-purple-dark);
        }

        main {
          max-width: 100%;
          width: 100%;
          padding: 1rem;
        }

        @media (min-width: 1024px) {
          main {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
