#!/bin/bash
# Quick verification script to display new structure
# Run after reorganization to verify results

BASE_DIR="/home/user/Marketing"

echo "=== BESPOKE ETHOS CRM STRUCTURE VERIFICATION ==="
echo ""

if [ -d "${BASE_DIR}/data" ]; then
    echo "NEW STRUCTURE EXISTS:"
    tree -L 4 "${BASE_DIR}/data" 2>/dev/null || find "${BASE_DIR}/data" -type d
    echo ""

    echo "FILE COUNTS:"
    echo "  Profiles (unified): $(ls ${BASE_DIR}/data/contacts/profiles/ 2>/dev/null | wc -l)"
    echo "  Tier A: $(ls ${BASE_DIR}/data/contacts/by-tier/tier-a-enterprise/ 2>/dev/null | wc -l)"
    echo "  Tier B: $(ls ${BASE_DIR}/data/contacts/by-tier/tier-b-mid-market/ 2>/dev/null | wc -l)"
    echo "  Tier C: $(ls ${BASE_DIR}/data/contacts/by-tier/tier-c-small/ 2>/dev/null | wc -l)"
    echo "  Batch 1: $(ls ${BASE_DIR}/data/contacts/by-batch/batch-1/ 2>/dev/null | wc -l)"
    echo "  Batch 2: $(ls ${BASE_DIR}/data/contacts/by-batch/batch-2/ 2>/dev/null | wc -l)"
    echo "  Batch 3: $(ls ${BASE_DIR}/data/contacts/by-batch/batch-3/ 2>/dev/null | wc -l)"
    echo "  Batch 4: $(ls ${BASE_DIR}/data/contacts/by-batch/batch-4/ 2>/dev/null | wc -l)"
    echo "  Batch 5: $(ls ${BASE_DIR}/data/contacts/by-batch/batch-5/ 2>/dev/null | wc -l)"
    echo "  Batch 6: $(ls ${BASE_DIR}/data/contacts/by-batch/batch-6/ 2>/dev/null | wc -l)"
    echo ""

    echo "IMPORT DIRECTORY:"
    ls -lh "${BASE_DIR}/data/import/" 2>/dev/null
    echo ""

    echo "ARCHIVE:"
    ls "${BASE_DIR}/data/archive/versions/" 2>/dev/null | wc -l
    echo " version files archived"

else
    echo "ERROR: Structure not created yet."
    echo "Run: ./reorganize_crm_data.sh"
fi
