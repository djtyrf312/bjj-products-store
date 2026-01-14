import './NavBar.css';

const NavBar = () => {
    const currentPath = window.location.pathname;

    return (
        <nav className="nav-bar">
            <ul className="nav-bar_links">
                <li className="nav-bar_link">
                    <a href="/" className={currentPath === '/' ? 'active' : ''}>Home</a>
                </li>
                <li className="nav-bar_link">
                    <a href="/products" className={currentPath === '/products' ? 'active' : ''}>Products</a>
                </li>
                <li className="nav-bar_link">
                    <a href="/add-product" className={currentPath === '/add-product' ? 'active' : ''}>Add product</a>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;