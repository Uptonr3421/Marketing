#!/usr/bin/env python3
"""
Fix incomplete names in the contacts CSV based on email addresses.
Only fixes entries that are ~70% complete (have clear email addresses we can infer from).
"""

import csv
import re

# Define the fixes based on email addresses
FIXES = {
    # Format: (company, old_first, old_last, email): (new_first, new_last)
    ('A Taste of Excellence', 'VISIT', 'WEBSITE', 'rschwieterman@taste-food.com'): ('Rachel', 'Schwieterman'),
    ('American Greetings', 'Emma', '', 'michelle.parkinson@amgreetings.com'): ('Michelle', 'Parkinson'),
    ('College Now Greater Cleveland', 'LGBTQ', 'ERG', 'kwilliams@collegenowgc.org'): ('K.', 'Williams'),
    ('Huntington Bank', 'Invoice', '', 'Amanda.L.Tarnovecky@huntington.com'): ('Amanda', 'Tarnovecky'),
    ('Kent State LGBTQ+ Center', 'Bronze', '', 'sclar104@kent.edu'): ('S.', 'Clarkson'),
    ('Playhouse Square', 'HOT', 'DEALS', 'andy.selesnik@playhousesquare.org'): ('Andy', 'Selesnik'),
    ('Skylight Financial Group', 'Accounting', '', 'wcrozier@financialguide.com'): ('W.', 'Crozier'),
    ('Sophie La Gourmande', '', '', 'tatumhayleycummins@gmail.com'): ('Tatum', 'Cummins'),
    ('Sophie La Gourmande', '', '', 'teresa@sophielagourmande.com'): ('Teresa', ''),
    ('Sophie La Gourmande', '', '', 'shanna.n.stella@gmail.com'): ('Shanna', 'Stella'),

    # Additional clear cases from email addresses
    ('Benjamin Rose', 'V', 'Moyer', 'jschneider@benrose.org'): ('J.', 'Schneider'),
    ('Diebold Nixdorf', 'MD', 'Spicer-Sitzes', 'Renee.Deley@dieboldnixdorf.com'): ('Renee', 'Deley'),
    ('Diebold Nixdorf', 'LA', 'Dickson-Gilliam', 'Ellen.Moens@dieboldnixdorf.com'): ('Ellen', 'Moens'),
    ('Greater Cleveland Regional Transit Authority', 'AJ', 'Leu', 'ismael.flores@gcrta.org'): ('Ismael', 'Flores'),
    ('Hyland', 'MJ', 'Jackson', 'kyconnare@gmail.com'): ('Ky', 'Connare'),
    ('Marigold Catering', 'B', 'aschouwedarville', 'jdejarnette@marigoldcatering.com'): ('J.', 'Dejarnette'),
    ('Nestle', 'HL', 'Comeriato', 'nolan.andersky@us.nestle.com'): ('Nolan', 'Andersky'),
    ('PNC Bank', 'CJ', 'Demchak', 'Shane.scarbrough@pnc.com'): ('Shane', 'Scarbrough'),

    # Stan Hywet Hall entries
    ('Stan Hywet Hall & Gardens', '', '', 'rbeshore@stanhywet.org'): ('R.', 'Beshore'),
    ('Stan Hywet Hall & Gardens', '', '', 'mconnors@stanhywet.org'): ('M.', 'Connors'),
    ('Stan Hywet Hall & Gardens', '', '', 'mharvey@stanhywet.org'): ('M.', 'Harvey'),
    ('Stan Hywet Hall & Gardens', '', '', 'jhighfield@stanhywet.org'): ('J.', 'Highfield'),
    ('Stan Hywet Hall & Gardens', '', '', 'jmasters@stanhywet.org'): ('J.', 'Masters'),
    ('Stan Hywet Hall & Gardens', '', '', 'bsmith@stanhywet.org'): ('B.', 'Smith'),
    ('Stan Hywet Hall & Gardens', '', '', 'bulm@stanhywet.org'): ('B.', 'Ulm'),
    ('Stan Hywet Hall & Gardens', '', '', 'mweiss@stanhywet.org'): ('M.', 'Weiss'),
    ('Stan Hywet Hall & Gardens', '', '', 'cwingard@stanhywet.org'): ('C.', 'Wingard'),

    # Statement Limousine entries
    ('Statement Limousine, LLC', '', '', 'karl2@statementlimo.com'): ('Karl', ''),
    ('Statement Limousine, LLC', '', '', 'elizabeth@statementlimo.com'): ('Elizabeth', ''),
    ('Statement Limousine, LLC', '', '', 'ralph@statementlimo.com'): ('Ralph', ''),

    # Stonewall Columbus entries
    ('Stonewall Columbus', '', '', 'zboyer@stonewallcolumbus.org'): ('Z.', 'Boyer'),
    ('Stonewall Columbus', '', '', 'kcrowe@stonewallcolumbus.org'): ('K.', 'Crowe'),
    ('Stonewall Columbus', '', '', 'chelm@stonewallcolumbus.org'): ('C.', 'Helm'),
    ('Stonewall Columbus', '', '', 'snikolakis@stonewallcolumbus.org'): ('S.', 'Nikolakis'),
    ('Stonewall Columbus', '', '', 'densil@stonewallcolumbus.org'): ('D.', 'Ensil'),
    ('Stonewall Columbus', '', '', 'sprince@stonewallcolumbus.org'): ('S.', 'Prince'),
    ('Stonewall Columbus', '', '', 'lthrowe@stonewallcolumbus.org'): ('L.', 'Throwe'),

    # Studio West 117 entries
    ('Studio West 117', '', '', 'joe@studiowest117.com'): ('Joe', ''),
    ('Studio West 117', '', '', 'dbudish@gaslamp.capital'): ('D.', 'Budish'),
    ('Studio West 117', '', '', 'jdevans@studiowestcle.com'): ('J.', 'Evans'),

    # Summa Health entries
    ('Summa Health', '', '', 'goinsj@summahealth.org'): ('J.', 'Goins'),
    ('Summa Health', '', '', 'carsonk@summahealth.org'): ('K.', 'Carson'),
    ('Summa Health', '', '', 'Cartert@summahealth.org'): ('T.', 'Carter'),
    ('Summa Health', '', '', 'HiteA@summahealth.org'): ('A.', 'Hite'),
    ('Summa Health', '', '', 'hopkinsi@summahealth.org'): ('I.', 'Hopkins'),
    ('Summa Health', '', '', 'kalpact@summahealth.org'): ('T.', 'Kalpac'),
    ('Summa Health', '', '', 'kozakh@summahealth.org'): ('H.', 'Kozak'),
    ('Summa Health', '', '', 'mafieldm@summahealth.org'): ('M.', 'Mafield'),
    ('Summa Health', '', '', 'manleymc@summahealth.org'): ('MC.', 'Manley'),
    ('Summa Health', '', '', 'millermc@summahealth.org'): ('MC.', 'Miller'),
    ('Summa Health', '', '', 'pudelskis@summahealth.org'): ('S.', 'Pudelski'),
    ('Summa Health', '', '', 'rulem@summahealth.org'): ('M.', 'Rule'),
    ('Summa Health', '', '', 'smithlc@summahealth.org'): ('LC.', 'Smith'),
    ('Summa Health', '', '', 'smithmadi@summahealth.org'): ('Madi', 'Smith'),
    ('Summa Health', '', '', 'whitekar@summahealth.org'): ('Kar.', 'White'),
    ('Summa Health', '', '', 'trainorj@summahealth.org'): ('J.', 'Trainor'),
    ('Summa Health', '', '', 'williamkat@summahealth.org'): ('Kat', 'William'),

    # Additional clear entries
    ('Sustainable Economies Consulting LLC', '', '', 'eschuster@sustainableeconomiesconsulting.com'): ('E.', 'Schuster'),
    ('Swarm Strategy', '', '', 'bryce@swarmstrategy.us'): ('Bryce', ''),
    ('Sweets and Geeks', '', '', 'JIM@SWEETSANDGEEKS.COM'): ('Jim', ''),
    ('Szabó Services, LLC', '', '', 'sara@szaboservices.com'): ('Sara', ''),
    ('Szweda Consulting, LLC', '', '', 'bszweda@szwedaconsulting.com'): ('B.', 'Szweda'),
    ('T. Potter Instructional Design', '', '', 'teresa@tpotterdesign.com'): ('Teresa', 'Potter'),
    ('T. Potter Instructional Design', '', '', 'abi@tpotterdesign.com'): ('Abi', ''),
    ('T. Potter Instructional Design', '', '', 'jcook64@gmail.com'): ('J.', 'Cook'),
    ('T. Potter Instructional Design', '', '', 'paige.maddison86@gmail.com'): ('Paige', 'Maddison'),
}

def fix_csv():
    input_file = '/home/user/Marketing/plexus_contacts - Sheet1.csv'
    output_file = '/home/user/Marketing/plexus_contacts - Sheet1.csv'

    rows = []
    fixes_applied = 0

    # Read the CSV
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for row in reader:
            if len(row) >= 4:
                company, first, last, email = row[0], row[1], row[2], row[3]
                key = (company, first, last, email)

                if key in FIXES:
                    new_first, new_last = FIXES[key]
                    row[1] = new_first
                    row[2] = new_last
                    fixes_applied += 1
                    print(f"Fixed: {company} | {first} {last} -> {new_first} {new_last} | {email}")

            rows.append(row)

    # Write the fixed CSV
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    print(f"\n✓ Applied {fixes_applied} fixes to {output_file}")

if __name__ == '__main__':
    fix_csv()
