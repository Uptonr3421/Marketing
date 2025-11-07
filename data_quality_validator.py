#!/usr/bin/env python3
"""
Data Quality Validation and Cleaning Script for Contact Records
Analyzes and fixes data quality issues in the plexus contacts CSV
"""

import csv
import re
from collections import defaultdict, Counter
from typing import List, Dict, Tuple
import os


class ContactDataValidator:
    def __init__(self, input_file: str):
        self.input_file = input_file
        self.contacts = []
        self.issues = defaultdict(list)
        self.stats = {
            'total_contacts': 0,
            'valid_emails': 0,
            'invalid_emails': 0,
            'missing_data': 0,
            'capitalization_issues': 0,
            'special_char_issues': 0,
            'potential_duplicates': 0
        }

    def load_contacts(self):
        """Load contacts from CSV file"""
        with open(self.input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            self.contacts = list(reader)
            self.stats['total_contacts'] = len(self.contacts)

    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        if not email or not email.strip():
            return False
        # Basic email regex pattern
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email.strip()))

    def fix_capitalization(self, text: str, is_name: bool = True) -> str:
        """Fix capitalization for names and companies"""
        if not text or not text.strip():
            return text

        text = text.strip()

        if is_name:
            # Handle special cases
            if text.upper() in ['LLC', 'LLP', 'INC', 'DR.', 'DR', 'MR.', 'MS.', 'MRS.']:
                return text.title()

            # Handle hyphenated names
            if '-' in text:
                parts = text.split('-')
                return '-'.join(part.capitalize() for part in parts)

            # Handle names with apostrophes
            if "'" in text:
                parts = text.split("'")
                return "'".join(part.capitalize() for part in parts)

            # Standard capitalization
            return text.title()
        else:
            # Company names - more complex rules
            return text.strip()

    def standardize_company_name(self, company: str) -> str:
        """Standardize company name formatting"""
        if not company:
            return company

        # Remove extra whitespace
        company = ' '.join(company.split())

        # Fix common patterns
        company = company.strip()

        return company

    def check_for_duplicates(self) -> List[List[Dict]]:
        """Check for potential duplicate contacts"""
        email_groups = defaultdict(list)
        name_groups = defaultdict(list)

        for idx, contact in enumerate(self.contacts):
            email = contact.get('Email', '').strip().lower()
            if email:
                email_groups[email].append((idx, contact))

            name_key = f"{contact.get('First Name', '').strip().lower()}_{contact.get('Last Name', '').strip().lower()}"
            if name_key != '_':
                name_groups[name_key].append((idx, contact))

        duplicates = []

        # Find email duplicates
        for email, contacts in email_groups.items():
            if len(contacts) > 1:
                duplicates.append([c for idx, c in contacts])

        # Find name duplicates (same name, different email)
        for name, contacts in name_groups.items():
            if len(contacts) > 1:
                emails = set(c.get('Email', '').strip().lower() for idx, c in contacts)
                if len(emails) > 1:
                    duplicates.append([c for idx, c in contacts])

        return duplicates

    def analyze_data_quality(self):
        """Perform comprehensive data quality analysis"""
        company_variations = defaultdict(list)

        for idx, contact in enumerate(self.contacts):
            row_num = idx + 2  # +2 for header and 1-indexing

            # Check email validity
            email = contact.get('Email', '')
            if not self.validate_email(email):
                self.issues['invalid_emails'].append({
                    'row': row_num,
                    'email': email,
                    'name': f"{contact.get('First Name', '')} {contact.get('Last Name', '')}"
                })
                self.stats['invalid_emails'] += 1
            else:
                self.stats['valid_emails'] += 1

            # Check for missing data
            for field in ['Company', 'First Name', 'Last Name', 'Email']:
                if not contact.get(field, '').strip():
                    self.issues['missing_data'].append({
                        'row': row_num,
                        'field': field,
                        'contact': f"{contact.get('First Name', '')} {contact.get('Last Name', '')}"
                    })
                    self.stats['missing_data'] += 1

            # Check name capitalization
            first_name = contact.get('First Name', '')
            last_name = contact.get('Last Name', '')

            if first_name and first_name != self.fix_capitalization(first_name):
                self.issues['capitalization'].append({
                    'row': row_num,
                    'field': 'First Name',
                    'original': first_name,
                    'suggested': self.fix_capitalization(first_name)
                })
                self.stats['capitalization_issues'] += 1

            if last_name and last_name != self.fix_capitalization(last_name):
                self.issues['capitalization'].append({
                    'row': row_num,
                    'field': 'Last Name',
                    'original': last_name,
                    'suggested': self.fix_capitalization(last_name)
                })
                self.stats['capitalization_issues'] += 1

            # Check for special characters
            for field in ['First Name', 'Last Name', 'Company']:
                value = contact.get(field, '')
                if value:
                    # Check for problematic characters
                    if re.search(r'[^\w\s\-.,&\'()]', value):
                        self.issues['special_chars'].append({
                            'row': row_num,
                            'field': field,
                            'value': value
                        })
                        self.stats['special_char_issues'] += 1

            # Collect company name variations
            company = contact.get('Company', '').strip()
            if company:
                normalized = company.lower().replace(' ', '').replace(',', '')
                company_variations[normalized].append((row_num, company))

        # Check for company name variations
        for normalized, variations in company_variations.items():
            if len(set(v[1] for v in variations)) > 1:
                self.issues['company_variations'].append({
                    'variations': list(set(v[1] for v in variations)),
                    'count': len(variations),
                    'rows': [v[0] for v in variations]
                })

        # Check for duplicates
        duplicates = self.check_for_duplicates()
        self.stats['potential_duplicates'] = len(duplicates)
        if duplicates:
            self.issues['duplicates'] = duplicates[:10]  # Store first 10

    def fix_contacts(self) -> List[Dict]:
        """Create fixed version of contacts"""
        fixed_contacts = []

        for contact in self.contacts:
            fixed = {}

            # Fix company name
            fixed['Company'] = self.standardize_company_name(contact.get('Company', ''))

            # Fix names
            fixed['First Name'] = self.fix_capitalization(contact.get('First Name', ''))
            fixed['Last Name'] = self.fix_capitalization(contact.get('Last Name', ''))

            # Standardize email (lowercase)
            email = contact.get('Email', '').strip()
            fixed['Email'] = email.lower() if email else ''

            fixed_contacts.append(fixed)

        return fixed_contacts

    def calculate_quality_score(self) -> float:
        """Calculate overall data quality score (0-100)"""
        if self.stats['total_contacts'] == 0:
            return 0

        total_fields = self.stats['total_contacts'] * 4  # 4 fields per contact

        # Deductions
        deductions = 0
        deductions += self.stats['invalid_emails'] * 3  # Invalid emails are serious
        deductions += self.stats['missing_data'] * 2   # Missing data is serious
        deductions += self.stats['capitalization_issues'] * 0.5  # Minor issue
        deductions += self.stats['special_char_issues'] * 1  # Moderate issue
        deductions += self.stats['potential_duplicates'] * 2  # Duplicates are concerning

        # Calculate score
        score = 100 - (deductions / total_fields * 100)
        return max(0, min(100, score))

    def generate_report(self) -> str:
        """Generate comprehensive data quality report"""
        report = []
        report.append("=" * 80)
        report.append("DATA QUALITY VALIDATION REPORT")
        report.append("=" * 80)
        report.append(f"\nFile: {self.input_file}")
        report.append(f"Analysis Date: 2025-11-07\n")

        # Summary Statistics
        report.append("-" * 80)
        report.append("SUMMARY STATISTICS")
        report.append("-" * 80)
        report.append(f"Total Contacts Analyzed: {self.stats['total_contacts']}")
        report.append(f"Valid Emails: {self.stats['valid_emails']}")
        report.append(f"Invalid Emails: {self.stats['invalid_emails']}")
        report.append(f"Missing Data Fields: {self.stats['missing_data']}")
        report.append(f"Capitalization Issues: {self.stats['capitalization_issues']}")
        report.append(f"Special Character Issues: {self.stats['special_char_issues']}")
        report.append(f"Potential Duplicates: {self.stats['potential_duplicates']}")

        # Quality Score
        quality_score = self.calculate_quality_score()
        report.append(f"\nOVERALL DATA QUALITY SCORE: {quality_score:.2f}/100")

        if quality_score >= 90:
            grade = "A (Excellent)"
        elif quality_score >= 80:
            grade = "B (Good)"
        elif quality_score >= 70:
            grade = "C (Fair)"
        elif quality_score >= 60:
            grade = "D (Poor)"
        else:
            grade = "F (Critical Issues)"

        report.append(f"Quality Grade: {grade}\n")

        # Detailed Issues
        report.append("-" * 80)
        report.append("DETAILED ISSUES BY CATEGORY")
        report.append("-" * 80)

        # Invalid Emails
        if self.issues['invalid_emails']:
            report.append(f"\n1. INVALID EMAILS ({len(self.issues['invalid_emails'])} found)")
            report.append("   " + "-" * 76)
            for issue in self.issues['invalid_emails'][:20]:  # Show first 20
                report.append(f"   Row {issue['row']}: {issue['name']} - '{issue['email']}'")
            if len(self.issues['invalid_emails']) > 20:
                report.append(f"   ... and {len(self.issues['invalid_emails']) - 20} more")

        # Missing Data
        if self.issues['missing_data']:
            report.append(f"\n2. MISSING DATA ({len(self.issues['missing_data'])} fields)")
            report.append("   " + "-" * 76)
            missing_by_field = defaultdict(int)
            for issue in self.issues['missing_data']:
                missing_by_field[issue['field']] += 1
            for field, count in missing_by_field.items():
                report.append(f"   {field}: {count} missing values")

        # Capitalization Issues
        if self.issues['capitalization']:
            report.append(f"\n3. CAPITALIZATION ISSUES ({len(self.issues['capitalization'])} found)")
            report.append("   " + "-" * 76)
            for issue in self.issues['capitalization'][:15]:  # Show first 15
                report.append(f"   Row {issue['row']} - {issue['field']}: '{issue['original']}' → '{issue['suggested']}'")
            if len(self.issues['capitalization']) > 15:
                report.append(f"   ... and {len(self.issues['capitalization']) - 15} more")

        # Company Name Variations
        if self.issues['company_variations']:
            report.append(f"\n4. COMPANY NAME VARIATIONS ({len(self.issues['company_variations'])} groups)")
            report.append("   " + "-" * 76)
            for var in self.issues['company_variations'][:10]:  # Show first 10
                report.append(f"   Found {len(var['variations'])} variations:")
                for v in var['variations']:
                    report.append(f"      - '{v}'")
                report.append(f"   Appears in {var['count']} records")
                report.append("")

        # Duplicates
        if self.issues['duplicates']:
            report.append(f"\n5. POTENTIAL DUPLICATES ({self.stats['potential_duplicates']} groups found)")
            report.append("   " + "-" * 76)
            for dup_group in self.issues['duplicates'][:5]:  # Show first 5 groups
                report.append(f"   Duplicate group:")
                for contact in dup_group:
                    report.append(f"      - {contact.get('First Name', '')} {contact.get('Last Name', '')} | {contact.get('Email', '')} | {contact.get('Company', '')}")
                report.append("")

        # Special Characters
        if self.issues['special_chars']:
            report.append(f"\n6. SPECIAL CHARACTER ISSUES ({len(self.issues['special_chars'])} found)")
            report.append("   " + "-" * 76)
            for issue in self.issues['special_chars'][:10]:  # Show first 10
                report.append(f"   Row {issue['row']} - {issue['field']}: '{issue['value']}'")

        # Recommendations
        report.append("\n" + "=" * 80)
        report.append("RECOMMENDATIONS")
        report.append("=" * 80)

        recommendations = []

        if self.stats['invalid_emails'] > 0:
            recommendations.append("• CRITICAL: Manually review and correct all invalid email addresses")
            recommendations.append("  These contacts cannot be reached via email campaigns")

        if self.stats['missing_data'] > 0:
            recommendations.append("• HIGH: Fill in missing data fields where possible")
            recommendations.append("  Complete records improve CRM functionality and targeting")

        if self.stats['potential_duplicates'] > 0:
            recommendations.append("• HIGH: Review and merge duplicate contacts")
            recommendations.append("  Duplicates can cause confusion and inflate contact counts")

        if self.issues['company_variations']:
            recommendations.append("• MEDIUM: Standardize company name variations")
            recommendations.append("  Consistent naming improves reporting and segmentation")

        if self.stats['capitalization_issues'] > 0:
            recommendations.append("• LOW: Fix capitalization for professional appearance")
            recommendations.append("  The script has automatically corrected these in the fixed version")

        if self.stats['special_char_issues'] > 0:
            recommendations.append("• MEDIUM: Review special characters for data integrity")
            recommendations.append("  Some characters may cause issues in imports/exports")

        for rec in recommendations:
            report.append(rec)

        report.append("\n" + "=" * 80)
        report.append("END OF REPORT")
        report.append("=" * 80)

        return "\n".join(report)

    def save_fixed_csv(self, output_file: str):
        """Save the fixed contacts to a new CSV file"""
        fixed_contacts = self.fix_contacts()

        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            if fixed_contacts:
                writer = csv.DictWriter(f, fieldnames=['Company', 'First Name', 'Last Name', 'Email'])
                writer.writeheader()
                writer.writerows(fixed_contacts)

        print(f"Fixed CSV saved to: {output_file}")

    def save_report(self, output_file: str):
        """Save the data quality report to a text file"""
        report = self.generate_report()

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"Report saved to: {output_file}")


def main():
    """Main execution function"""
    input_file = "/home/user/Marketing/plexus_contacts - Sheet1.csv"
    fixed_file = "/home/user/Marketing/plexus_contacts_FIXED.csv"
    report_file = "/home/user/Marketing/data_quality_report.txt"

    print("=" * 80)
    print("DATA QUALITY VALIDATION AND CLEANING")
    print("=" * 80)
    print(f"\nAnalyzing: {input_file}")

    # Initialize validator
    validator = ContactDataValidator(input_file)

    # Load contacts
    print("\n[1/4] Loading contacts...")
    validator.load_contacts()
    print(f"      Loaded {validator.stats['total_contacts']} contacts")

    # Analyze data quality
    print("\n[2/4] Analyzing data quality...")
    validator.analyze_data_quality()
    print(f"      Found {len(validator.issues)} issue categories")

    # Generate and save report
    print("\n[3/4] Generating report...")
    validator.save_report(report_file)

    # Save fixed CSV
    print("\n[4/4] Creating fixed CSV...")
    validator.save_fixed_csv(fixed_file)

    # Display summary
    print("\n" + "=" * 80)
    print("VALIDATION COMPLETE")
    print("=" * 80)
    print(f"\nQuality Score: {validator.calculate_quality_score():.2f}/100")
    print(f"\nKey Metrics:")
    print(f"  • Total Contacts: {validator.stats['total_contacts']}")
    print(f"  • Valid Emails: {validator.stats['valid_emails']}")
    print(f"  • Invalid Emails: {validator.stats['invalid_emails']}")
    print(f"  • Missing Data: {validator.stats['missing_data']} fields")
    print(f"  • Capitalization Issues: {validator.stats['capitalization_issues']}")
    print(f"  • Potential Duplicates: {validator.stats['potential_duplicates']}")

    print(f"\nOutputs:")
    print(f"  • Report: {report_file}")
    print(f"  • Fixed CSV: {fixed_file}")
    print("\n" + "=" * 80)


if __name__ == "__main__":
    main()
