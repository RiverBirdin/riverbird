"""
RiverBird AI Chatbot Knowledge Base & Context Engine.
Handles natural language queries, service matching, and context-aware responses about RiverBird.
"""

import re

RIVERBIRD_KNOWLEDGE = {
    "company": {
        "name": "RiverBird",
        "description": "RiverBird is a leading Technology, Digital Marketing, and Talent Growth agency. We help brands scale through high-converting web applications, performance marketing, SEO, creative design, and top-tier staffing solutions.",
        "tagline": "Empowering Growth Through Tech, Marketing & Talent."
    },
    "services": {
        "digital_marketing": {
            "title": "Digital Marketing & Brand Growth",
            "keywords": ["marketing", "digital marketing", "growth", "ads", "advertising", "traffic", "leads"],
            "details": "Our Digital Marketing suite includes performance-driven strategies across SEO, Paid Social & Search Ads, Social Media Management, Influencer Partnerships, and Personal Branding."
        },
        "seo": {
            "title": "SEO (Search Engine Optimization)",
            "keywords": ["seo", "google ranking", "search engine", "keywords", "organic traffic", "backlinks"],
            "details": "We provide end-to-end SEO services including Technical Audits, On-Page Optimization, High-Authority Link Building, and Keyword Strategy to rank #1 on Google and drive qualified organic leads."
        },
        "social_media": {
            "title": "Social Media Marketing",
            "keywords": ["social media", "instagram", "linkedin", "facebook", "content", "reels", "posts"],
            "details": "We manage your social presence end-to-end with high-converting content, viral video reels, community engagement, and data-backed growth strategies for Instagram, LinkedIn, Facebook, and X."
        },
        "paid_ads": {
            "title": "Paid Advertising (PPC)",
            "keywords": ["paid ads", "ppc", "google ads", "meta ads", "facebook ads", "instagram ads", "ad campaigns"],
            "details": "Maximize your ROI with targeted Google Ads, Meta Ads (Facebook & Instagram), Retargeting campaigns, and Conversion Rate Optimization designed to lower customer acquisition costs."
        },
        "influencer_marketing": {
            "title": "Influencer Marketing",
            "keywords": ["influencer", "creators", "collaborations", "influencer marketing"],
            "details": "We connect your brand with top niche influencers and content creators to drive authentic brand awareness and high-converting audience engagement."
        },
        "personal_branding": {
            "title": "Personal Branding",
            "keywords": ["personal brand", "executive", "founder", "thought leadership", "linkedin growth"],
            "details": "We build compelling personal brands for executives, founders, and industry leaders through strategic LinkedIn management, PR, and high-impact content."
        },
        "video_production": {
            "title": "Video Production & Graphic Design",
            "keywords": ["video", "production", "graphics", "design", "branding", "logo", "ui/ux", "reels"],
            "details": "From promotional videos and product demos to modern brand identity, logos, and UI/UX designs, our creative team crafts stunning visuals that wow your audience."
        },
        "software_web": {
            "title": "Web App & Software Development",
            "keywords": ["software", "web development", "website", "app", "custom software", "coding", "full stack", "react", "python", "flask"],
            "details": "We build fast, scalable web applications, custom software solutions, enterprise portals, and modern responsive websites built for speed, conversion, and security."
        },
        "staffing_talent": {
            "title": "Staffing & Talent Management",
            "keywords": ["staffing", "recruitment", "hiring talent", "talent pool", "manpower", "rpo", "hr", "developers"],
            "details": "We provide flexible staffing, Recruitment Process Outsourcing (RPO), tech talent placement, and manpower supply tailored to your organization's exact requirements."
        },
        "careers": {
            "title": "Careers & Job Opportunities",
            "keywords": ["career", "careers", "job", "jobs", "hiring", "internship", "internships", "apply", "work with us", "vacancy", "vacancies", "openings", "join"],
            "details": "RiverBird offers exciting career and internship opportunities across IT (Software & Web Engineering), Digital Marketing, SEO, Graphic Design, and Video Production. We are always looking for passionate talent to join our team!"
        }
    }
}


def generate_bot_response(user_message, history=None):
    """
    Processes user query and returns contextual, humanized answer along with lead prompt signals.
    """
    msg_lower = user_message.lower().strip()

    # 1. Greetings
    if re.search(r'\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b', msg_lower):
        return {
            "text": "Hi there! 👋 Welcome to RiverBird! I'm here to help you grow your business or explore exciting career opportunities.\n\nWhat can I assist you with today?",
            "prompt_lead": False,
            "suggested_questions": ["Web Development", "SEO Ranking", "Digital Marketing", "Career Opportunities", "Get a Custom Quote"]
        }

    # 2. Pricing / Quote / Contact / Call Intent -> Immediate Contact Collection
    if re.search(r'\b(quote|price|pricing|cost|consult|call|proposal|estimate|book|talk|contact|reach|connect)\b', msg_lower):
        return {
            "text": "We'd love to put together a personalized project proposal and pricing breakdown for you! 😊\n\nCould you please share your **Name, Email Address, and Phone/WhatsApp Number** so our specialist team can reach out to you directly?",
            "prompt_lead": True,
            "suggested_questions": ["Web App Quote", "Digital Marketing Audit", "Staffing Inquiry", "Careers"]
        }

    # 3. Match Knowledge Base Topics
    matched_services = []
    for key, info in RIVERBIRD_KNOWLEDGE["services"].items():
        for kw in info["keywords"]:
            if re.search(r'\b' + re.escape(kw) + r'\b', msg_lower):
                matched_services.append(info)
                break

    if matched_services:
        primary = matched_services[0]
        text_response = f"**{primary['title']} at RiverBird:**\n\n{primary['details']}\n\nTo help us send you full service details, portfolio samples, or set up a quick 1-on-1 call, could you share your **Name, Email, and Phone Number** below?"
        return {
            "text": text_response,
            "prompt_lead": True,
            "service": primary['title'],
            "suggested_questions": ["Request Callback & Proposal", "Career Opportunities", "View Other Services"]
        }

    # 4. General Info / Who are we
    if re.search(r'\b(who|about|riverbird|company|what do you do)\b', msg_lower):
        return {
            "text": f"{RIVERBIRD_KNOWLEDGE['company']['description']}\n\nWould you like our team to get in touch with you for a free consultation? Please leave your **Name, Email, and Phone Number** below!",
            "prompt_lead": True,
            "suggested_questions": ["Web Development", "SEO Services", "Careers", "Request Callback"]
        }

    # 5. Default Fallback
    return {
        "text": "Thanks for reaching out! RiverBird specializes in Web & Software Engineering, SEO, Performance Marketing, Graphic Design, Video Production, and Staffing Solutions.\n\nMay I have your **Name, Email, and Phone/WhatsApp Number** so our team can send you relevant information?",
        "prompt_lead": True,
        "suggested_questions": ["Web Engineering", "Digital Marketing", "Careers", "Request Callback & Quote"]
    }
