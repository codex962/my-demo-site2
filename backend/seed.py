import uuid

IMG = {
    "station_night": "https://images.unsplash.com/photo-1674521645695-815ef207866b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    "truck": "https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg?auto=compress&w=1600",
    "energy": "https://images.unsplash.com/photo-1643139863038-7355941e9e89?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    "sf": "https://images.pexels.com/photos/2539433/pexels-photo-2539433.jpeg?auto=compress&w=1600",
}

PAGES = [
    {
        "slug": "home",
        "title": "Synergy Petroleum — #1 in Premium and Private Label Fuel",
        "sections": {
            "hero": {
                "overline": "Northern California Fuel Distribution",
                "heading": "Fueling the Future of Northern California",
                "subheading": "Premium and private label fuel distribution, retail operations, and round-the-clock maintenance — delivered with unmatched reliability.",
                "cta_primary": "Discover Our Services",
                "cta_secondary": "Contact Us",
            },
            "strengths": {
                "overline": "Our Key Strengths",
                "heading": "Quality in every step of our process",
                "items": [
                    {"title": "Branded Wholesale", "description": "Partner with top fuel brands and gain access to exclusive programs and competitive pricing.", "link": "/brands"},
                    {"title": "Unbranded Wholesale", "description": "One of the main suppliers of unbranded biofuels, diesel and gasoline throughout Northern California.", "link": "/brands"},
                    {"title": "Maintenance & Services", "description": "24/7 help desk with on-site technicians for all your station equipment needs.", "link": "/maintenance"},
                    {"title": "Retail Locations", "description": "A growing network of convenience stores and gas stations across the Bay Area.", "link": "/locations"},
                    {"title": "Mobil Branded Lubricants", "description": "Full line of Mobil branded packaged lubricants for commercial and retail customers.", "link": "/brands"},
                ],
            },
            "pillars": {
                "items": [
                    {"title": "Synergy Maintenance", "description": "24/7 help desk with on-site technicians that will go out and take care of any of your on-site needs."},
                    {"title": "Smart Purchasing", "description": "We continuously monitor market trends to single out the best buying opportunities and deliver the best rates to you."},
                    {"title": "Community", "description": "Devoted to giving back through employee volunteerism, sponsorship, and local events. A good corporate citizen and a good neighbor."},
                ]
            },
            "cta": {
                "heading": "Ready to power your business?",
                "subheading": "Join hundreds of stations and fleets across Northern California that trust Synergy Petroleum.",
                "button": "Get in Touch",
            },
        },
    },
    {
        "slug": "brands",
        "title": "Brands — Synergy Petroleum",
        "sections": {
            "hero": {
                "overline": "Our Brands",
                "heading": "Your Fuel Partner",
                "subheading": "Sales and delivery of fuels all over Northern California — branded, unbranded, and everything in between.",
            },
            "benefits": {
                "heading": "Synergy Petroleum Benefits",
                "items": [
                    {"title": "Take Advantage of Our Experience", "description": "For many years, our team of professionals has supported stations all over San Francisco. We provide professional guidance on branding decisions to make sure your company runs profitably. Synergy Petroleum provides the momentum your business needs."},
                    {"title": "Exclusive Packages", "description": "We offer exclusive packages and competitive discount pricing with retail vendors, and Commercial Fueling Network accessibility. Synergy Petroleum presents a diversity of choices and makes your choices very easy."},
                    {"title": "Team Up With Us", "description": "Teaming up with us means a company agent will regularly visit your station to help with your business development. You'll have the support you need in all aspects of running and growing your company."},
                ],
            },
            "provide": {
                "heading": "We Provide",
                "items": [
                    {"title": "Flexible payment terms", "value": 100},
                    {"title": "Quality services and fuel", "value": 100},
                    {"title": "Inventory management", "value": 100},
                ],
                "description": "Synergy Petroleum is one of the main suppliers of unbranded biofuels, diesel and gasoline throughout Northern California. We offer unparalleled customer service, superior products and competitive rates, plus market analysis and inventory management to improve your buying price and market timing.",
            },
        },
    },
    {
        "slug": "services",
        "title": "Services — Synergy Petroleum",
        "sections": {
            "hero": {
                "overline": "What We Do",
                "heading": "Services Built Around Your Business",
                "subheading": "From wholesale fuel supply to fleet fueling and market analysis — we cover the full spectrum of petroleum services.",
            },
        },
    },
    {
        "slug": "maintenance",
        "title": "Synergy Maintenance & Services",
        "sections": {
            "hero": {
                "overline": "Synergy Maintenance & Services",
                "heading": "24/7 Help Desk. On-Site Technicians. Zero Downtime.",
                "subheading": "Our in-house technical teams are always on hand — with certified expertise across the leading fuel equipment platforms.",
            },
            "expertise": {
                "heading": "Certified Equipment Expertise",
                "items": [
                    {"title": "Gilbarco", "description": "Certified service and support for Gilbarco Veeder-Root dispensers, payment systems, and point of sale."},
                    {"title": "Veeder Root", "description": "Tank monitoring, automatic tank gauging, and compliance solutions installed and maintained by certified techs."},
                    {"title": "Gasboy", "description": "Fleet fueling systems and commercial fuel management solutions serviced end-to-end."},
                ],
            },
            "helpdesk": {
                "heading": "Round-the-Clock Support",
                "description": "24/7 help desk with on-site technicians that will go out and take care of any of your on-site needs. Around-the-clock deliveries and devoted in-house dispatchers keep your station running.",
            },
        },
    },
    {
        "slug": "whyus",
        "title": "Why Us — Synergy Petroleum",
        "sections": {
            "hero": {
                "overline": "Why Us",
                "heading": "Why Go Into Business With Us?",
                "subheading": "One-stop shop. Around-the-clock service. Locally run and operated.",
            },
            "reasons": {
                "items": [
                    {"title": "First-Rate Customer Service", "description": "Synergy Petroleum runs unbranded and branded wholesale businesses in San Francisco; we also oversee retail businesses through our own network of convenience stores and gas stations. Synergy Petroleum is your one-stop shop."},
                    {"title": "Speedy Response", "description": "Synergy Petroleum is available round-the-clock. Our in-house technical teams and Sales Representatives are always on hand to respond to all of your burning questions. Around-the-clock deliveries and devoted in-house dispatchers."},
                    {"title": "Infrastructure", "description": "Synergy Petroleum was established in San Francisco and is locally run and operated. We are in charge of a fuel distribution network in California and run gas stations across the region."},
                    {"title": "Reliability", "description": "Our goal is to guarantee an unfailing customer experience that offers unmatched quality, trustworthy services, and products at a competitive rate. We always pay attention to our clients and are part of their everyday lives."},
                ]
            },
        },
    },
    {
        "slug": "company",
        "title": "Company — Synergy Petroleum",
        "sections": {
            "hero": {
                "overline": "About Us",
                "heading": "Locally Grown. Regionally Trusted.",
                "subheading": "Established in San Francisco, Synergy Petroleum has grown into one of Northern California's leading fuel distributors.",
            },
            "story": {
                "heading": "Our Story",
                "description": "Synergy Petroleum was established in San Francisco and is locally run and operated. Today we manage a fuel distribution network across California, operate our own gas stations and convenience stores, and support hundreds of wholesale partners. We pride ourselves on being a good corporate citizen and a good neighbor — promoting employee volunteerism, sponsorships, and local community events.",
            },
            "mission": {
                "heading": "Our Mission",
                "description": "To guarantee an unfailing customer experience that offers unmatched quality, trustworthy services, and products at a competitive rate — while giving back to the communities we serve.",
            },
            "stats": {
                "items": [
                    {"label": "Years of Experience", "value": "20+"},
                    {"label": "Retail Locations", "value": "15+"},
                    {"label": "Support Availability", "value": "24/7"},
                    {"label": "Counties Served", "value": "10+"},
                ]
            },
        },
    },
    {
        "slug": "contact",
        "title": "Contact — Synergy Petroleum",
        "sections": {
            "hero": {
                "overline": "Contact",
                "heading": "Let's Talk Fuel",
                "subheading": "Whether you're a station operator, fleet manager, or wholesale buyer — our team is ready to help.",
            },
        },
    },
]

LOCATIONS = [
    {"name": "South San Francisco HQ", "address": "510 Myrtle Ave Suite 209", "city": "South San Francisco, CA", "lat": 37.6547, "lng": -122.4077, "type": "Headquarters", "description": "Corporate headquarters and dispatch center."},
    {"name": "San Francisco Station", "address": "Mission District", "city": "San Francisco, CA", "lat": 37.7599, "lng": -122.4148, "type": "Gas Station", "description": "Full-service station with convenience store."},
    {"name": "San Mateo Station", "address": "El Camino Real", "city": "San Mateo, CA", "lat": 37.5630, "lng": -122.3255, "type": "Gas Station", "description": "Branded fuel and Mobil lubricants."},
    {"name": "Daly City Station", "address": "Mission Street", "city": "Daly City, CA", "lat": 37.6879, "lng": -122.4702, "type": "Gas Station", "description": "24-hour fueling and convenience store."},
    {"name": "San Jose Station", "address": "Stevens Creek Blvd", "city": "San Jose, CA", "lat": 37.3230, "lng": -121.9500, "type": "Gas Station", "description": "South Bay retail and fleet fueling."},
    {"name": "Central Valley Hub", "address": "Highway 99 Corridor", "city": "Stockton, CA", "lat": 37.9577, "lng": -121.2908, "type": "Distribution Hub", "description": "Central Valley fuel distribution and logistics."},
]

BRANDS = [
    {"name": "Synergy Petroleum", "tagline": "Premium & Private Label Fuel", "description": "Our flagship brand — premium and private label fuel distribution across Northern California with unmatched service and competitive rates.", "image": IMG["station_night"], "order": 1},
    {"name": "Central Gas", "tagline": "Neighborhood Fueling", "description": "Our retail network of neighborhood gas stations and convenience stores serving Bay Area communities every day.", "image": IMG["sf"], "order": 2},
    {"name": "Synergy Lube", "tagline": "Lubricants & Beyond", "description": "Full line of packaged lubricants for commercial, industrial, and retail customers — stocked and delivered on your schedule.", "image": IMG["truck"], "order": 3},
    {"name": "Mobil Partnership", "tagline": "Mobil Branded Packaged Lubricants", "description": "Authorized distributor of Mobil branded packaged lubricants — world-class products backed by local delivery and support.", "image": IMG["energy"], "order": 4},
]

SERVICES = [
    {"name": "Branded Wholesale", "description": "Access exclusive branded fuel programs, imaging support, and competitive pricing backed by major fuel brands.", "icon": "GasPump", "order": 1},
    {"name": "Unbranded Wholesale", "description": "One of Northern California's main suppliers of unbranded biofuels, diesel, and gasoline — with flexible payment terms.", "icon": "Drop", "order": 2},
    {"name": "Fleet Fueling", "description": "Commercial Fueling Network accessibility, fleet card programs, and on-site fueling solutions for fleets of any size.", "icon": "Truck", "order": 3},
    {"name": "Renewable Fuels", "description": "Biofuels and renewable diesel supply to help your operation meet California's clean energy standards.", "icon": "Leaf", "order": 4},
    {"name": "Market Analysis", "description": "We continuously monitor fuel market trends to identify the best buying opportunities and improve your market timing.", "icon": "ChartLineUp", "order": 5},
    {"name": "Inventory Management", "description": "Tank monitoring and inventory management services to optimize your buying price and never run dry.", "icon": "Gauge", "order": 6},
]

SETTINGS = {
    "key": "contact_info",
    "phone": "(650) 634-8449",
    "email": "info@casynergy.com",
    "address": "510 Myrtle Ave Suite 209, South San Francisco, CA 94080",
    "hours": "24/7 Help Desk — Office: Mon–Fri 8am–6pm",
}


async def seed_data(db):
    if await db.pages.count_documents({}) == 0:
        await db.pages.insert_many([dict(p) for p in PAGES])
    if await db.locations.count_documents({}) == 0:
        await db.locations.insert_many([{**l, "id": str(uuid.uuid4())} for l in LOCATIONS])
    if await db.brands.count_documents({}) == 0:
        await db.brands.insert_many([{**b, "id": str(uuid.uuid4())} for b in BRANDS])
    if await db.services.count_documents({}) == 0:
        await db.services.insert_many([{**s, "id": str(uuid.uuid4()), "image": s.get("image", "")} for s in SERVICES])
    if await db.settings.count_documents({"key": "contact_info"}) == 0:
        await db.settings.insert_one(dict(SETTINGS))
