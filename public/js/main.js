const hookRegionSorter = () => {
    const regionSelect = document.getElementById('region-filter');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const selectedRegion = regionSelect.value;
            const url = new URL(window.location.href);

            if (selectedRegion && selectedRegion !== 'all') {
                url.searchParams.set('region', selectedRegion);
            } else {
                url.searchParams.delete('region');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookSeasonSorter = () => {
    const seasonSelect = document.getElementById('season-filter');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            const url = new URL(window.location.href);

            if (selectedSeason && selectedSeason !== 'all') {
                url.searchParams.set('season', selectedSeason);
            } else {
                url.searchParams.delete('season');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

const hookTripsCatalog = async () => {
    const listEl = document.querySelector('.routes-grid');
    const templateEl = document.getElementById('trip-card-template');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        let trips = payload.trips || [];
        const fragment = document.createDocumentFragment();

        const params = new URLSearchParams(window.location.search);
        const season = params.get('season');
        const region = params.get('region');

        if (season && season !== 'all') {
            trips = trips.filter(trip => trip.bestSeason === season);
        }

        if (region && region !== 'all') {
            trips = trips.filter(trip => trip.region === region);
        }

        trips.forEach((trip) => {
            const card = templateEl.content.cloneNode(true);
            card.querySelector(".route-card").classList.add(trip.region)
            card.querySelector(".route-name").textContent = trip.name
            card.querySelector(".route-region").textContent = trip.region

            card.querySelector(".start-station").textContent = trip.startStation
            card.querySelector(".end-station").textContent = trip.endStation
            card.querySelector(".trip-duration").textContent = `Duration: ${trip.duration}`
            card.querySelector(".trip-distance").textContent = `Distance: ${trip.duration}`
            card.querySelector(".trip-best-season").classList.add(`season-${trip.bestSeason}`)
            card.querySelector(".trip-best-season").textContent = `Best in ${trip.bestSeason}`
            card.querySelector(".route-description").textContent = trip.description

            trip.highlights.forEach( highlight => {
                const span = document.createElement("span")
                span.classList.add("highlight-tag")
                span.textContent = highlight

                card.querySelector(".highlights-list").appendChild(span)
            })

            card.querySelector(".trip-link").href = `/trips/${trip.id}`

         

         
            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
       
    } catch (error) {
        console.log(error)
    }
};

const hookSchedulesCatalog = () => {
    const monthSelect = document.getElementById('month');
    const listEl = document.querySelector('.schedules-grid');
    const templateEl = document.getElementById('schedule-card-template');

    if (!monthSelect || !listEl || !templateEl) return;

    // Fetch whenever the selected month changes
    monthSelect.onchange = async function () {

        const month = this.value;
        const tripId = window.location.pathname.split('/').pop();

        console.log('Month changed:', month);

        if (!month) {
            listEl.innerHTML = '<p>Please select a month.</p>';
            return;
        }

        const url = `/api/trips/${tripId}/schedules?month=${month}`;

        console.log('Fetching:', url);

        try {
            listEl.innerHTML = '<p>Loading schedules...</p>';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const payload = await response.json();

            console.log('Received schedules:', payload);

            const schedules = payload.data.schedules || [];
            const fragment = document.createDocumentFragment();

            if (schedules.length === 0) {
                listEl.innerHTML = '<p>No schedules available.</p>';
                return;
            }

            schedules.forEach(schedule => {
                const card = templateEl.content.cloneNode(true);

                card.querySelector('.depart-time').textContent = schedule.departureTime;
                card.querySelector('.arrival-time').textContent = schedule.arrivalTime;

                const daysContainer = card.querySelector('.schedule-days');

                schedule.daysOfWeek.forEach(day => {
                    const span = document.createElement('span');
                    span.classList.add('day-badge');
                    span.textContent = day.substring(0, 3);
                    daysContainer.appendChild(span);
                });

                card.querySelector('.book-now').href =
                    `/trips/booking/${schedule.id || schedule._id}`;

                fragment.appendChild(card);
            });

            listEl.replaceChildren(fragment);

        } catch (error) {
            console.error('Schedule error:', error);
            listEl.innerHTML = '<p>Unable to load schedules.</p>';
        }
    };
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookTripsCatalog();
    hookSchedulesCatalog()

    
});

