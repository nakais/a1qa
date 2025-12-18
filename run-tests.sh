#!/bin/bash

###############################################################################
# Test Execution Script - Digital Document Sending E2E Tests
# Usage: ./run-tests.sh [options]
###############################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

###############################################################################
# Functions
###############################################################################

print_header() {
    echo -e "\n${BLUE}=================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_env_file() {
    if [ ! -f "$SCRIPT_DIR/.env" ]; then
        print_error ".env file not found!"
        print_info "Creating .env from .env.example..."
        cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
        print_warning "Please update .env file with your credentials before running tests"
        exit 1
    fi
    print_success ".env file found"
}

check_dependencies() {
    print_info "Checking dependencies..."
    
    if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
        print_warning "node_modules not found. Installing dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Failed to install dependencies"
            exit 1
        fi
    fi
    print_success "Dependencies are installed"
}

check_browsers() {
    print_info "Checking Playwright browsers..."
    
    if [ ! -d "$HOME/.cache/ms-playwright" ]; then
        print_warning "Playwright browsers not found. Installing..."
        npx playwright install chromium
        if [ $? -ne 0 ]; then
            print_error "Failed to install browsers"
            exit 1
        fi
    fi
    print_success "Browsers are installed"
}

show_usage() {
    echo "Usage: ./run-tests.sh [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -u, --ui            Run tests in UI mode (interactive)"
    echo "  -d, --debug         Run tests in debug mode"
    echo "  -H, --headed        Run tests in headed mode (show browser)"
    echo "  -r, --report        Show test report after execution"
    echo "  -s, --suite <name>  Run specific test suite (e.g., digital-docs)"
    echo "  -c, --check         Only check prerequisites, don't run tests"
    echo ""
    echo "Examples:"
    echo "  ./run-tests.sh                    # Run all tests"
    echo "  ./run-tests.sh --ui               # Run in UI mode"
    echo "  ./run-tests.sh --headed           # Show browser while testing"
    echo "  ./run-tests.sh --suite digital-docs  # Run specific suite"
}

###############################################################################
# Main Script
###############################################################################

print_header "Digital Document Sending E2E Test Suite"

# Parse command line arguments
RUN_MODE="normal"
SHOW_REPORT=false
CHECK_ONLY=false
TEST_SUITE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -u|--ui)
            RUN_MODE="ui"
            shift
            ;;
        -d|--debug)
            RUN_MODE="debug"
            shift
            ;;
        -H|--headed)
            RUN_MODE="headed"
            shift
            ;;
        -r|--report)
            SHOW_REPORT=true
            shift
            ;;
        -s|--suite)
            TEST_SUITE="$2"
            shift 2
            ;;
        -c|--check)
            CHECK_ONLY=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Check prerequisites
print_header "Checking Prerequisites"

cd "$SCRIPT_DIR"
check_env_file
check_dependencies
check_browsers

print_success "All prerequisites satisfied!"

if [ "$CHECK_ONLY" = true ]; then
    print_info "Check-only mode. Exiting without running tests."
    exit 0
fi

# Run tests based on mode
print_header "Running Tests"

case $RUN_MODE in
    ui)
        print_info "Running tests in UI mode..."
        if [ -n "$TEST_SUITE" ]; then
            npm run test:ui -- tests/e2e/$TEST_SUITE
        else
            npm run test:ui
        fi
        ;;
    debug)
        print_info "Running tests in debug mode..."
        if [ -n "$TEST_SUITE" ]; then
            npm run test:debug -- tests/e2e/$TEST_SUITE
        else
            npm run test:debug
        fi
        ;;
    headed)
        print_info "Running tests in headed mode..."
        if [ -n "$TEST_SUITE" ]; then
            npm run test:headed -- tests/e2e/$TEST_SUITE
        else
            npm run test:headed
        fi
        ;;
    normal)
        print_info "Running tests in normal mode..."
        if [ -n "$TEST_SUITE" ]; then
            npm run test:$TEST_SUITE
        else
            npm test
        fi
        ;;
esac

TEST_EXIT_CODE=$?

# Check test results
print_header "Test Results"

if [ $TEST_EXIT_CODE -eq 0 ]; then
    print_success "All tests passed! ✓"
else
    print_error "Some tests failed. Exit code: $TEST_EXIT_CODE"
fi

# Show report if requested
if [ "$SHOW_REPORT" = true ]; then
    print_info "Opening test report..."
    npm run report
fi

print_header "Test Execution Complete"

exit $TEST_EXIT_CODE
