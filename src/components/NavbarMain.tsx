import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { siteConfig } from "~/constants/client/site";


export const NavbarMain: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <header className={`${siteConfig.colors.nav}`}>
            <div className="container">
                <div className="flex h-20 items-center justify-between py-6">
                    {/* Mobile Menu */}
                    <div className={`md:hidden ${siteConfig.colors.navText}`}>
                        <div className="dropdown dropdown-bottom dropdown-start">
                            <label tabIndex={1} className="btn btn-ghost btn-circle">
                                <div className="w-12 rounded-full">
                                    <img src="/static/svg/menu.svg" alt=""/>
                                </div>
                            </label>
                            <ul tabIndex={1} className="menu dropdown-content z-[1] p-2 shadow bg-custom-gray w-52 rounded-sm drop-shadow-2xl text-custom-black font-semibold">
                                <li><Link href="/">Home</Link></li> 
                                <li><Link href="/pricing">Booking</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className={`hidden md:flex gap-6 md:gap-10 text-xl ${siteConfig.colors.navText} font-bold`}>
                        <Link href="/">
                            <p className="bg-custom-pink text-black text-xs rounded-full px-2">LO<br></br>GO</p>
                        </Link>
                        <Link href="/">
                            <p>Home</p>
                        </Link>
                        <Link href="/pricing">
                            <p>Pricing</p>
                        </Link>
                    </div>


                    <nav className="flex gap-6 items-center">
                        {(
                            sessionData
                        ) ? (
                            <div className="dropdown dropdown-bottom dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            <img src={sessionData?.user.image ?? "/static/images/avatar_placeholder.png"} />
                                        </div>
                                    </div>
                                </label>
                                <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-custom-gray rounded-box w-52 drop-shadow-2xl text-custom-black">
                                    <li><a className="fake-disabled text-lg pb-0">{sessionData && sessionData.user?.name}</a></li>
                                    <li><a className="fake-disabled">{sessionData && sessionData.user?.email}</a></li>
                                    <li className="border-t my-1"></li>
                                    <li><Link href="/account">Dashboard</Link></li> 
                                    <li><Link href="/account/booking">Booking</Link></li> 
                                    <li><Link href="/account/billing">Billing</Link></li>
                                    <li className="border-t my-1"></li>
                                    <li><button onClick={() => void signOut()}>Sign Out</button></li>
                                </ul>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => void signIn()}
                            >
                                Sign In / Up
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};
