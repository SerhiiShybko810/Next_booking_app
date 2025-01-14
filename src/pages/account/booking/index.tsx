import { type GetServerSidePropsContext } from "next";
import { type ReactElement, useEffect, useRef } from "react";
import AccountLayout from "~/components/AccountLayout";
import { Booking } from "~/components/Booking";
import RootLayout from "~/components/RootLayout";
import { type NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import { useRouter } from "next/router";
import { useErrorToast, useInfoToast, useSuccessToast } from "~/components/ToastContext";
import { prisma } from "~/server/db";
import { stripe } from "~/server/stripe/stripeClient";
import { createStripeSessionResume, forceStripeSessionExpire } from "~/server/stripe/stripeServerSideHandlers";
import Link from "next/link";
import Head from "next/head";
import { siteConfig } from "~/constants/client/site";


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const status = ctx.query?.status;

    if (status === "success") {
        return {
            redirect: {
                destination: "/account/booking?status=success_completed",
                permanent: false,
            },
        };
    }
    if (status === "canceled") {
        await forceStripeSessionExpire({ session, prisma, stripe});
        return {
            redirect: {
                destination: "/account/booking?status=cancellation_completed",
                permanent: false,
            },
        };
    }

    const result = await createStripeSessionResume({session, prisma, stripe});
    return {
        props: result,
    };
}

interface BookingPageProps {
    url?: undefined | null | string;
    cancelUrl?: undefined | null | string;
}
const BookingPage: NextPageWithLayout<BookingPageProps> = (props) => {
    const { url, cancelUrl } = props;
    const toastSuccess = useSuccessToast();
    const toastError = useErrorToast();
    const toastInfo = useInfoToast();
    const router = useRouter();
    const { status = "default" } = router.query;
    const effectCalled = useRef<boolean>(false);

    useEffect(() => {
        if (effectCalled.current) return;
        if (status === "success_completed") {
            toastSuccess("Payment successful! Your booking has been made!")
            effectCalled.current = true;
        }
        if (status === "cancellation_completed") {
            toastInfo("Your booking was successfully cancelled.")
            effectCalled.current = true;
        }
    }, [status, toastSuccess, toastInfo])

    // TODO create seperate component for below
    if (url && cancelUrl) {
        return(
            <>  
                <Head>
                    <title>Complete Booking?</title>
                    <meta name="description" content={`Booking for ${siteConfig.companyName}`}/>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="flex flex-col gap-4 justify-center items-center border-[2px] border-dotted border-custom-black w-full p-6 rounded-lg">
                    <p className="text-xl text-custom-black">Pending Booking Session</p>
                    <Link href={url}><button className="btn btn-primary">Click to resume</button></Link>
                    <Link href={cancelUrl}><button className="btn btn-accent">Cancel</button></Link>
                </div>
            </>
        );
    }

    return(
        <>
            <Head>
                <title>Booking</title>
                <meta name="description" content={`Booking for ${siteConfig.companyName}`}/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex w-full flex-start flex-col">
                <h2 className="text-4xl font-bold text-custom-black">Booking</h2>
                <p className="text-xl text-custom-brown">Create new booking.</p>
            </div>
            <Booking />
        </>
    );
};

BookingPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <RootLayout>
            <AccountLayout>
                {page}
            </AccountLayout>
        </RootLayout>
    );
};

export default BookingPage;
