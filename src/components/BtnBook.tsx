import { type UserSubscriptionPlan } from "~/types";
import { 
    CONFERENCE_ROOM_ID, 
    PHONE_BOOTH_A_ID, 
    PHONE_BOOTH_B_ID
} from "~/constants/client/rooms";
import { useErrorToast } from "./ToastContext";


interface BtnBookProps {
    userSubscriptionPlan: UserSubscriptionPlan;
    date: DateType;
    handleCreateBooking: (startTime: Date) => Promise<void>;
    createBookingIsLoading: boolean;
    room: RoomType;
    purchaseSessionLoading: boolean;
    handleCreatePurchaseBookingSession: (startTime: Date) => Promise<void>;
}

export const BtnBook: React.FC<BtnBookProps> = ({
    userSubscriptionPlan,
    date,
    handleCreateBooking,
    createBookingIsLoading,
    room,
    purchaseSessionLoading,
    handleCreatePurchaseBookingSession,
}) => {
    // TODO include check for number of rooms to be capped
    const toastError = useErrorToast();

    if (!userSubscriptionPlan) {
        return <p>Subscription details missing</p>
    }

    // Authorization control for booking. One of the following must be true:
    // IF user is on Pro plan, full access.
    // IF user is on Plus Conference plan, full access if the selected room is conference.
    // IF user is on Plus Phone plan, full access if the selected room is a phone booth.
    if (
        userSubscriptionPlan.isPro ||
        (userSubscriptionPlan.isPlusConference && room.roomId === CONFERENCE_ROOM_ID) ||
        (userSubscriptionPlan.isPlusPhone && room.roomId === PHONE_BOOTH_A_ID || room.roomId === PHONE_BOOTH_B_ID)
    ) {
        return (
            <button 
                className="btn btn-primary" 
                type="button" 
                onClick={() => date.dateTime 
                    ? handleCreateBooking(date.dateTime) 
                    : toastError("Oops! Something went wrong. No date and time selected.")
                }
                disabled={createBookingIsLoading}
            >
                Book
            </button>
        );
    }

    // Else, user must purchase booking.
    return (
        <button
            className="btn btn-primary"
            type="button"
            disabled={purchaseSessionLoading}
            onClick={() => date.dateTime 
                ? handleCreatePurchaseBookingSession(date.dateTime) 
                : toastError("Oops! Something went wrong. No date and time selected.")
            }
        >
            Purchase Booking
        </button>
    );
}
