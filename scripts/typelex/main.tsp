import "@typelex/emitter";

namespace blue.deniz.event {
  model Main {
    @required @readOnly v: numeric = 0;
    @required name: Translations;
    description?: Translations;
    venues?: Venue[];
    instances?: EventInstance[];
    status?: EventStatus;
  }

  alias Translations = unknown;
  scalar PartialDate extends string;

  union EventStatus {
    "planned",
    "uncertain",
    "postponed",
    "cancelled",
    "suspended",
    string,
  }

  @inline union Venue { PhysicalVenue, OnlineVenue }

  model PhysicalVenue {
    @required venueId: string;
    @required @readOnly venueType: string = "physical";
    @required venueName: Translations;
    address?: Address;
    coordinates?: Coordinates;
  }

  model Address {
    addr?: string;
    countryCode?: string;
    postalCode?: string;
  }

  model Coordinates {
    @required lat: numeric;
    @required lng: numeric;
  }

  model OnlineVenue {
    @required venueId: string;
    @required @readOnly venueType: string = "online";
    @required venueName: Translations;
    url?: string;
  }

  model EventInstance {
    venueIds?: string[];
    start?: PartialDate;
    end?: PartialDate;
    status?: EventStatus;
  }
}
