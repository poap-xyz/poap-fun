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
  virtual_event?: boolean;
  supply?: number;
};

export type UserPoap = {
  event: PoapEvent;
  tokenId: string;
  owner: string;
};

export type PoapEventDictionary = {
  [id: number]: PoapEvent;
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
  draw_datetime: string | null;
  start_date_helper: string;
  end_datetime: string | null;
  one_address_one_vote: boolean;
  token?: string;
  prizes: Prize[];
  events: SimpleEvent[];
  results_table: number | null;
  finalized: boolean;
};

export type CompleteRaffle = {
  id: number;
  name: string;
  description: string;
  contact: string;
  draw_datetime: string | null;
  start_date_helper: string;
  end_datetime: string | null;
  one_address_one_vote: boolean;
  prizes: Prize[];
  events: PoapEvent[];
  results_table: number | null;
  finalized: boolean;
};

export type FetchResponseRaffle = {
  count: number;
  results: Raffle[];
};

export type CreatePrize = {
  name: string;
  order: number;
};

export type CreateEvent = {
  event_id: string;
  name: string;
};

export type CreateRaffleValues = {
  name: string;
  description: string;
  contact: string;
  draw_datetime: string | null;
  start_date_helper: string;
  one_address_one_vote: boolean;
  prizes: CreatePrize[];
  events: CreateEvent[];
};

export type Participant = {
  id: number;
  address: string;
  ens_name: string | null;
  poap_id: number;
  event_id: string;
};

export type ResultsTableEntry = {
  id: number;
  order: number;
  participant: Participant;
};

export type ResultsTable = {
  id: number;
  raffle_id: number;
  entries: ResultsTableEntry[];
};

export type JoinRaffleValues = {
  signature: string;
  message: string;
  address: string;
  raffle_id: number;
};

export type BlockData = {
  id: number;
  raffle: number;
  order: number;
  block_number: number;
  gas_limit: number;
  timestamp: number;
};
