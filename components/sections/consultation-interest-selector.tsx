"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  fieldControlClasses,
  fieldLabelClasses,
} from "@/components/ui/form-styles";
import { contactInterestOptions } from "@/data/contact";

export function ConsultationInterestSelector() {
  const [interest, setInterest] = useState("");
  const contactHref = interest ? `/contact?interest=${interest}` : "/contact";

  return (
    <div className="grid gap-5">
      <div>
        <label className={fieldLabelClasses} htmlFor="consultation-interest">
          Immigration interest
        </label>
        <select
          className={fieldControlClasses}
          id="consultation-interest"
          onChange={(event) => setInterest(event.target.value)}
          value={interest}
        >
          <option value="">Select an area to discuss</option>
          {contactInterestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ButtonLink href={contactHref}>
        Continue To Contact
        <ArrowRight aria-hidden="true" size={18} />
      </ButtonLink>
    </div>
  );
}
