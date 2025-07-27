const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const {
  sequelize,
  Class,
  Registration,
  Student,
  ClassSelection,
} = require("./models");
const { initializeDatabase, resetClasses } = require("./db");
const { Op } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database when server starts
initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});

// Routes
app.get("/api/classes", async (req, res) => {
  try {
    // Get all classes with enrollment count
    const classes = await Class.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM class_selections WHERE class_selections.class_id = "Class".id)',
            ),
            "enrolled",
          ],
        ],
      },
    });

    // Calculate availability for each class
    const classesWithAvailability = classes.map((cls) => {
      const classObj = cls.toJSON();
      const enrolled = parseInt(classObj.enrolled || 0);

      return {
        ...classObj,
        enrolled,
        available: cls.capacity - enrolled,
      };
    });

    res.json(classesWithAvailability);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { parentInfo, students } = req.body;

    // Basic validation
    if (
      !parentInfo ||
      !parentInfo.name ||
      !parentInfo.email ||
      !parentInfo.phone
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Parent information is required" });
    }

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "At least one student must be registered",
        });
    }

    // Validate each student
    for (const student of students) {
      if (!student.name) {
        return res
          .status(400)
          .json({ success: false, message: "Student name is required" });
      }

      if (
        !student.classSelections ||
        !Array.isArray(student.classSelections) ||
        student.classSelections.length !== 3
      ) {
        return res.status(400).json({
          success: false,
          message: `Student ${student.name} must select exactly 3 classes`,
        });
      }

      // Check class availability for each selected class
      for (const classId of student.classSelections) {
        // Get class with enrollment count
        const classObj = await Class.findByPk(classId, {
          attributes: {
            include: [
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM class_selections WHERE class_selections.class_id = "Class".id)',
                ),
                "enrolled",
              ],
            ],
          },
          transaction,
        });

        if (!classObj) {
          await transaction.rollback();
          return res
            .status(400)
            .json({
              success: false,
              message: `Invalid class selection: ${classId}`,
            });
        }

        const enrolled = parseInt(classObj.get("enrolled") || 0);

        if (enrolled >= classObj.capacity) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Class ${classObj.name} is already full`,
          });
        }
      }
    }

    // Create registration with unique ID
    const registrationId =
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    // Insert registration
    const registration = await Registration.create(
      {
        id: registrationId,
        parentName: parentInfo.name,
        parentEmail: parentInfo.email,
        parentPhone: parentInfo.phone,
      },
      { transaction },
    );

    // Insert students and their class selections
    for (const studentData of students) {
      const student = await Student.create(
        {
          registrationId: registrationId,
          name: studentData.name,
          age: studentData.age,
          allergies: studentData.allergies || "",
          medicalNotes: studentData.medicalNotes || "",
        },
        { transaction },
      );

      // Create class selections for this student
      const classSelections = studentData.classSelections.map((classId) => ({
        studentId: student.id,
        classId,
      }));

      await ClassSelection.bulkCreate(classSelections, { transaction });
    }

    await transaction.commit();

    res.json({
      success: true,
      registrationId,
      message: "Registration completed successfully",
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error processing registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    // Get all registrations with their associated students and class selections
    const registrations = await Registration.findAll({
      include: [
        {
          model: Student,
          as: "students",
          include: [
            {
              model: Class,
              as: "classes",
              through: { attributes: [] }, // Don't include join table data
            },
          ],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    // Format the response to match the frontend's expectations
    const formattedRegistrations = registrations.map((registration) => {
      const reg = registration.toJSON();

      return {
        id: reg.id,
        parentInfo: {
          name: reg.parentName,
          email: reg.parentEmail,
          phone: reg.parentPhone,
        },
        students: reg.students.map((student) => ({
          id: student.id,
          name: student.name,
          age: student.age,
          allergies: student.allergies,
          medicalNotes: student.medicalNotes,
          classSelections: student.classes.map((cls) => cls.id),
          classNames: student.classes.map((cls) => cls.name),
        })),
        timestamp: reg.timestamp,
      };
    });

    res.json(formattedRegistrations);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/registrations/:id", async (req, res) => {
  try {
    // Get a specific registration with its students and class selections
    const registration = await Registration.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: "students",
          include: [
            {
              model: Class,
              as: "classes",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    // Format the response
    const reg = registration.toJSON();
    const formattedRegistration = {
      id: reg.id,
      parentInfo: {
        name: reg.parentName,
        email: reg.parentEmail,
        phone: reg.parentPhone,
      },
      students: reg.students.map((student) => ({
        id: student.id,
        name: student.name,
        age: student.age,
        allergies: student.allergies,
        medicalNotes: student.medicalNotes,
        classSelections: student.classes.map((cls) => cls.id),
        classNames: student.classes.map((cls) => cls.name),
      })),
      timestamp: reg.timestamp,
    };

    res.json({
      success: true,
      registration: formattedRegistration,
    });
  } catch (err) {
    console.error("Error fetching registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin endpoint to reset classes
app.post("/api/admin/reset-classes", async (req, res) => {
  try {
    await resetClasses();
    res.json({
      success: true,
      message: "Classes reset successfully",
    });
  } catch (err) {
    console.error("Error resetting classes:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
