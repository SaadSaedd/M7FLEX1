CREATE SCHEMA IF NOT EXISTS weer;
USE weer;


CREATE TABLE IF NOT EXISTS weersomstandighedenPerDag(
    idWeersomstandighedenPerDag INT UNSIGNED NOT NULL,
    datum DATE NOT NULL,
    aantal DECIMAL NOT NULL,
    PRIMARY KEY (idWeersomstandighedenPerDag),
    UNIQUE INDEX idWeersomstandighedenPerDag_UNIQUE (idWeersomstandighedenPerDag ASC) VISIBLE
);




