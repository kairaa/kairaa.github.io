export default function Navbar() {
    return (
        <nav className="py-1">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <a href="/" className="flex items-center p-4 md:p-0 space-x-3 rtl:space-x-reverse">
                    <span className="block py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent font-semibold">kairaa.dev</span>
                </a>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                        <li>
                            <a href="/links" className="block py-2 text-gray-900 rounded md:bg-transparent md:p-0" aria-current="page">links</a>
                        </li>
                        <li>
                            <a href="/about" className="block py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0">about</a>
                        </li>
                        <li>
                            <a href="/contact" className="block py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0">contact</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-screen-xl mx-auto">
                <hr className="border-t border-black" />
            </div>
        </nav>
    );
}
