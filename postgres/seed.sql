CREATE TABLE users
(
    id SERIAL NOT NULL , 
    username character varying(200),
    password character varying(200),
    email character varying,
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE "deliveryNotes"
(
    id SERIAL NOT NULL , 
    name character varying(255),
    job character varying(255), 
    address character varying(255),
    city character varying(255), 
    "loadingPlace" character varying(255),
    "taxOffice" character varying(255), 
    destination character varying(255),
    "createdAt" date,
    "updatedAt" date,
    details character varying(255)[], 
    "VATRegistrationNum" character varying(600), 
    file character varying(255),
    CONSTRAINT "deliveryNotes_pkey" PRIMARY KEY (id)
);
