# Agent Behavioral Constraints

Infrastructure is complete. The architecture is frozen.

**Default action: compose, not extend.**

Every AI agent must first ask:
"Can I solve this with a Rule, Worker, Connector, Repository, Strategy, Prompt, or Dashboard?"

**DO NOT** touch the Prisma schema or foundational interfaces unless it solves a production problem, improves a measurable business KPI, and absolutely cannot be implemented by composition on top of existing services.
