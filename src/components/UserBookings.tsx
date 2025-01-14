"use client"

import { api } from "~/utils/api";
import { Alert } from "./Alert";
import Link from "next/link";
import { SingleBookingCard } from "./SingleBookingCard";
import { useErrorToast, useSuccessToast } from "./ToastContext";
import { LoadingBars } from "./LoadingBars";


/**
 * Container component for displaying user bookings on account dashboard.
 */
export const UserBookings: React.FC = () => {
    const toastError = useErrorToast();
    const toastSuccess = useSuccessToast();
    const utils = api.useContext();
    const { 
        data: userBookingsData, 
        isLoading: userBookingsLoading, 
        isError: userBookingsError 
    } = api.booking.getUserBookings.useQuery();
    const deleteBooking = api.booking.deleteBooking.useMutation({
        onSuccess() {
            toastSuccess("Booking successfully cancelled");
            void utils.booking.invalidate();
        }
    });

    const handleDeleteBooking = (bookingId: string, bookingUserId: string) => {
        try {
            deleteBooking.mutate({
                bookingId: bookingId,
                bookingUserId: bookingUserId,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                toastError(`Oops! Something went wrong. Error: ${error.message}`)
            }
        }
    };

    if(userBookingsError) {
        return (
            <>
                <p>Error</p>
            </>
        )
    }

    if(userBookingsLoading) {
        return (
            <LoadingBars />
        )
    }

    if(userBookingsData && userBookingsData.length === 0) {
        return(
            <div>
                <Alert dark={true} text={"ℹ️ You currently have no future bookings. Get started by going to the booking page."}/>
                <div className="flex justify-center p-4">
                    <Link href="/account/booking"><button className="btn btn-primary">Go to Booking</button></Link>
                </div>
            </div>
        )
    }

    return(
        <>
            <div className="border-2 border-custom-brown rounded-sm p-4 flex flex-col gap-2">
                <p className="text-xl">Upcoming Meetings</p>
                {userBookingsData && userBookingsData.length > 0 && userBookingsData.map(booking =>
                    <div key={booking.id}>
                        <SingleBookingCard 
                            booking={booking}
                            handleDeleteBooking={handleDeleteBooking} 
                        />
                    </div>
                )}
            </div>
        </>
    );
}