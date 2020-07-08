export type Event = {
  id: number;
  name: string;
  image_url: string;
};

export type PoapEvent = {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  virtual_event: boolean;
};

export type Prize = {
  id: number;
  name: string;
  order: number;
};

export type SimpleEvent = {
  id: number;
  event_id: string;
  name: string;
};

export type Raffle = {
  id: number;
  name: string;
  description: string;
  contact: string;
  draw_datetime: string;
  end_datetime: string | null;
  registration_deadline: string;
  one_address_one_vote: string;
  prizes: Prize[];
  events: SimpleEvent[];
};

export type CompleteRaffle = {
  id: number;
  name: string;
  description: string;
  contact: string;
  draw_datetime: string;
  end_datetime: string | null;
  registration_deadline: string;
  one_address_one_vote: string;
  prizes: Prize[];
  events: PoapEvent[];
};

export type FetchResponseRaffle = {
  count: number;
  results: Raffle[];
};
