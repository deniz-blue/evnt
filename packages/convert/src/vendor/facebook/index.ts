export interface FacebookEvent {
    id: string;
    attending_count: number;
    can_guests_invite: boolean;
    category: string;
    cover: {
        id: string;
        offset_x: number;
        offset_y: number;
        source: string;
    };
    created_time: string;
    description: string;
    event_times: Array<object>;
    is_canceled: boolean;
    is_draft: boolean;
    is_online: boolean;
    is_page_owned: boolean;
    name: string;
    place: {
        id: string;
        name: string;
        location: {
            city: string;
            country: string;
            latitude: number;
            longitude: number;
            street: string;
            zip: string;
        };
    };
    start_time: string;
    ticket_uri: string;
    ticket_uri_start_sales_time: string;
    timezone: string;
    type: string;
    updated_time: string;
};
